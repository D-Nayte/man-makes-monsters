import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import CardTemplate from "../../../components/CardTemplate";
import DragAndDropContainer from "../../../features/Drag&Drop";
import Czar from "../../../components/Czar";
import Countdown from "../../../components/Countdown";
import PlayedWhite from "../../../components/PlayedWhite";
import Winner from "../../../components/Winner";
import Error from "../../../components/Error";
import Scoreboard from "../../../components/Scoreboard";
import Loading from "../../../components/Loading";
import { useAppContext } from "../../../context";
import GameEnd from "../../../components/GameEnd";
import { BsFillTrophyFill } from "react-icons/bs";

const Game = ({ socket }) => {
  if (!socket)
    return (
      <main>
        <Loading />
      </main>
    );
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [lobbyId, setLobbyId] = useState(null);
  const cookies = parseCookies();
  const [isHost, setHost] = useState(false);
  const [playerName, setPlayerName] = useState(null);
  const [isInactive, setIsInactive] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [hand, setHand] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [blackCards, setBlackCards] = useState([]);
  const [playedWhite, setPlayedWhite] = useState(null);
  const [bot1, setBot1] = useState(null);
  const [bot2, setBot2] = useState(null);
  const [timerTrigger, setTimerTrigger] = useState(false);
  const [confirmed, setConfirmed] = useState();
  let [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(false);
  const [cardsOnTable, setCardsOnTable] = useState(false);
  let playedBlackFromCzar = null;
  const [isCzar, setIsCzar] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [currentLobby, setCurrentLobby] = useState(false);
  const [gameIdentifier, setGameIdentifier] = useState(null);
  const [listenersReady, setListenersReady] = useState(false);
  const [maxHandSize, setMaxHandSize] = useState(null);
  const [gameEnds, setGameEnds] = useState(false);
  const { storeData, setStoreData } = useAppContext();
  const [reconnect, setReconnect] = useState(false);
  let currentTimer = false;

  const chooseBlackCard = (selected) => {
    setTimer(false);
    const playerData = {
      playedBlack: selected,
      playerId: cookies.socketId,
      stage: "black",
      blackCards,
      gameId,
      lobbyId,
    };

    // if czar left == timer runs out
    if (!selected) {
      const leavePlayer = {
        playerId: cookies.socketId,
        gameId,
        lobbyId,
      };
      return socket.emit("changeGame", { ...leavePlayer, leavedGame: true });
    }

    socket.emit("changeGame", playerData);
  };

  const whiteCardChoosed = (cards, bot) => {
    setTimer(false);
    const playerData = {
      playerId: bot?.id || cookies.socketId,
      stage: "white",
      blackCards,
      gameId,
      lobbyId,
      playedWhite: bot?.hand?.splice(0, 2) || cards,
    };

    //if timer runs out, submit random white cards based on black cards pick
    if (!cards && !bot) {
      const pick = cardsOnTable.table.cards[0].pick;
      playerData.playedWhite = cardsOnTable.player.cards.splice(0, pick);
      setCardsOnTable((prev) => ({ ...cardsOnTable }));

      socket.emit("changeGame", { ...playerData });
      socket.emit("changeGame", { ...playerData, leavedGame: true });
      return;
    }

    socket.emit("changeGame", { ...playerData, leavedGame: false });
    setConfirmed(true);
  };

  //display text from white cards inside black card while char is choosing winner
  const handleMouseOver = (cards) => {
    setCardsOnTable((prev) => {
      return {
        ...prev,
        table: { ...prev.table, cards: [...prev.table.cards, ...cards] },
      };
    });
  };

  //delete text again from white cards inside black card while char is choosing winner
  const handleMouseLeave = (cards) => {
    setCardsOnTable((prev) => {
      return {
        ...prev,
        table: { ...prev.table, cards: prev.table.cards.slice(0, 1) },
      };
    });
  };

  // sbumit choosed winner from czar
  const submitWinner = (cards) => {
    const playerData = {
      playerId: cookies.socketId,
      stage: "winner",
      gameId,
      lobbyId,
      winningCards: cards,
    };

    if (!cards) {
      playerData.winningCards = playedWhite[0];
      socket.emit("changeGame", { ...playerData, leavedGame: true });
      return;
    }

    socket.emit("changeGame", { ...playerData });
  };

  //clicking the ready button, stores ready state in DB
  const checkoutRound = (id) => {
    setTimer(false);

    //prevent player from smashing ready button like an idiot ^^
    if (
      currentLobby.turns[currentLobby.turns.length - 1].completed.find(
        (player) => player.player_id === id
      )
    )
      return;

    const playerData = {
      playerId: cookies.socketId,
      stage: "completed",
      gameId,
      lobbyId,
    };

    socket.emit("changeGame", { ...playerData });
  };

  //getting new white cards
  const getNewWhiteCard = () => {
    const playerData = {
      playerId: cookies.socketId,
      gameId,
      lobbyId,
    };

    if (cardsOnTable.player.cards.length < maxHandSize) {
      socket.emit("changeGame", {
        ...playerData,
        sendWhiteCards: true,
      });
    }
  };

  //  clsoes the game and display the game end component
  const handleClosingGame = (input) => {
    const force = input?.force;
    if (isHost || force) {
      const playerData = {
        playerId: cookies.socketId,
        gameId,
        lobbyId: storeData.lobbyId,
        closeGame: true,
      };
      socket.emit("changeGame", { ...playerData });
    }
  };

  const processGame = ({ currentGame, err }) => {
    //if player got kicket
    const player = currentGame?.players.find(
      (player) => player.id === cookies.socketId
    );
    if (currentGame?.kicked && !player)
      return (
        setShowErrMessage("You got kicked! Redirecting you back"),
        setTimeout(() => {
          router.push("/");
        }, 3500)
      );

    //if error ocurred
    if (err || (!currentGame && !kicked)) {
      setShowErrMessage(
        err ? err : "You are not part of this game! Redirecting you back"
      );
      setTimeout(() => {
        router.push("/");
      }, 3000);
      return;
    }

    //if game was closed, show Game end component
    if (currentGame.concluded) {
      setGameEnds(true);
      setTimer(false);
    }

    //if less then 3 players, close the game after 3.5s, else abort the closing function
    if (
      currentGame.players.filter((player) => !player.inactive).length < 3 &&
      !currentGame.concluded
    ) {
      setShowErrMessage(
        "Not enough Players left, game will be closed within 3 seconds"
      );
      handleClosingGame({ force: true });

      setTimeout(() => {
        router.push(`/lobby/${storeData.lobbyId}`);
      }, 3500);
      return;
    }

    // if players cookie is not stored inside game Object = player is not part of the game, redirect to hompage
    if (!currentGame.players.find((player) => player.id === cookies.socketId)) {
      setShowErrMessage("Your are not part of this game, redirecting you back");
      return setTimeout(() => {
        router.push(`/`);
      }, 3000);
    }

    const lastTurnIndex = currentGame.turns.length - 1;
    const lastTurn = currentGame.turns[lastTurnIndex];
    playedBlackFromCzar = lastTurn.black_card;
    const currentCzarId = lastTurn?.czar?.id;
    const playerId = cookies.socketId;
    const currentPlayer = currentGame.players?.find(
      (player) => player.id === playerId
    );
    const confirmedWhiteCards =
      currentCzarId !== cookies.socketId &&
      lastTurn.white_cards.length > 0 &&
      lastTurn.white_cards.find((player) => player.player === playerId)
        ?.played_card;
    const currentTurnIndex = currentGame.turns.length - 1;
    const currentStageIndex =
      currentGame.turns[currentTurnIndex].stage.length - 1;
    if (currentPlayer) {
      // get game stage and player cards from current game wich is response from server
      const stage =
        currentGame.turns[currentTurnIndex].stage[currentStageIndex];
      let { hand, isHost } = currentPlayer;
      const { black_cards } = currentGame.deck;

      //set inactive state if player missed a round and display it as error
      currentPlayer.inactive ? setIsInactive(true) : setIsInactive(false);

      //check if the host
      if (isHost)
        setHost(true), setStoreData((prev) => ({ ...prev, isHost: true }));
      else setHost(false), setStoreData((prev) => ({ ...prev, isHost: false }));

      //skipp dealing phase because of rerender
      if (stage === "dealing") return setGameStage(stage);

      //check is czar
      currentCzarId === cookies.socketId ? setIsCzar(true) : setIsCzar(false);

      //if czar and stage white is is currently runnning, display white cards from users
      if (stage === "white" || stage === "deciding") {
        const playerList = lastTurn.white_cards
          .map((player) => player.played_card)
          .filter((cards) => cards.length > 0);
        setPlayedWhite(playerList.length > 0 ? playerList : null);
      }

      // during white stage, only update players screen if incoming black card differs from current one or already white cards where submitted
      if (confirmedWhiteCards?.length > 0 && !isCzar && currentPlayer) {
        setConfirmed(true);
        setCardsOnTable({
          table: {
            label: "table",
            cards: playedBlackFromCzar
              ? [playedBlackFromCzar, ...confirmedWhiteCards]
              : [],
          },
          player: { label: "player", cards: hand },
        });
      } else if (
        cardsOnTable?.table?.cards?.length < 1 ||
        cardsOnTable?.player?.cards?.length < 1 ||
        !cardsOnTable ||
        cardsOnTable?.table?.cards[0]?.text !== playedBlackFromCzar?.text
      ) {
        setCardsOnTable({
          table: {
            label: "table",
            cards: playedBlackFromCzar ? [playedBlackFromCzar] : [],
          },
          player: { label: "player", cards: hand },
        });
      }
      setMaxHandSize(currentGame.handSize);
      setCurrentLobby(currentGame);
      setPlayerName(currentPlayer.name);
      setCurrentTurn(lastTurn);
      setBlackCards((prev) => (prev = black_cards));
      setHand(hand);
      setGameId(currentGame.id);
      setTimerTrigger(currentGame.timerTrigger);
      setGameStage(stage);
      setStoreData((prev) => ({
        ...prev,
        changeAvatar: currentGame.changeAvatar,
      }));
      setBot1(currentGame.players[1]);
      setBot2(currentGame.players[2]);
    }
  };

  useEffect(() => {
    //getting whole game infos, also rejoin player to socket io
    socket.on("currentGame", ({ currentGame, err, kicked }) => {
      setLoading(false);
      processGame({ currentGame, err, kicked });
    });
    setListenersReady(true);
    return () => {
      socket.removeAllListeners();
      setListenersReady(false);
    };
  }, [router.isReady, gameStage, reconnect]);

  //self update page after got redirected, use key from query as lobby id
  useEffect(() => {
    if (lobbyId) {
      socket.emit("getUpdatedGame", {
        lobbyId: router.query.lobbyId,
        playerName,
        id: cookies.socketId,
      });
    }
  }, [lobbyId, listenersReady]);

  // setup lobbyID from router after router is ready
  useEffect(() => {
    if (router.query.gameId && router.query.lobbyId) {
      setGameIdentifier(router.query.gameId[0]);
      setLobbyId(router.query.lobbyId);
      setStoreData((prev) => ({
        ...prev,
        lobbyId: router.query.lobbyId,
        gameIdentifier: router.query.gameId[0],
      }));
    }
    socket.io.on("reconnect", () => {
      setListenersReady((prev) => !prev);
      setReconnect((prev) => !prev);
    });
  }, [router.isReady]);

  // start dealing phase automalicly after game starts
  useEffect(() => {
    if (lobbyId) {
      if (gameStage === "start" && isHost && !loading) {
        socket.emit("changeGame", {
          blackCards,
          player: { hand, id: cookies.socketId },
          stage: "dealing",
          gameId,
          lobbyId,
        });
      }

      if (gameStage === "black") setConfirmed(false);
    }
  }, [gameStage, isCzar]);

  // timer runs out logic
  useEffect(() => {
    // choose random white cards, submit and set player inactive
    if (timer === null && gameStage === "white" && !isCzar && !confirmed) {
      whiteCardChoosed(null);
    }
    // set czar inactive and assign a new one
    if (timer === null && gameStage === "black" && isCzar) {
      chooseBlackCard();
    }
    // set czar inactive and assign a new one
    if (timer === null && gameStage === "deciding" && isCzar) {
      submitWinner();
    }
    if (timer === null && gameStage === "winner") {
      checkoutRound(cookies.socketId);
    }
  }, [timer]);

  useEffect(() => {
    if (currentLobby) {
      let lastTurnindex = currentLobby.turns.length - 1;
      if (lastTurnindex < 0) lastTurnindex = 0;
      setTimeout(() => {
        if (gameStage === "black" && !isCzar) chooseBlackCard(blackCards[0]);
        if (gameStage === "white" && !isCzar && confirmed) {
          whiteCardChoosed(null, bot1);
          whiteCardChoosed(null, bot2);
        }
        if (gameStage === "white" && isCzar) whiteCardChoosed(null, bot2);
        if (gameStage === "white" && isCzar) whiteCardChoosed(null, bot1);
        if (gameStage === "deciding" && !isCzar)
          submitWinner(
            currentLobby.turns[lastTurnindex].white_cards[0].played_card
          );
        if (gameStage === "winner") checkoutRound(bot1.id);
        if (gameStage === "winner") checkoutRound(bot2.id);
      }, 1000);
    }
  }, [gameStage, confirmed]);

  if (loading && !currentLobby)
    return (
      <main>
        <Loading />
        {currentLobby && (
          <>
            <Scoreboard
              currentLobby={currentLobby}
              socket={socket}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </>
        )}
      </main>
    );

  if (showErrMessage)
    return (
      <main>
        <h1>An error ocurred</h1>

        {showErrMessage && (
          <Error
            showErrMessage={showErrMessage}
            setShowErrMessage={setShowErrMessage}
          />
        )}
      </main>
    );

  if (gameEnds) return <GameEnd currentGame={currentLobby} />;
  return (
    <main className="game">
      {gameStage === "winner" ? (
        <>
          {currentLobby && (
            <>
              <Scoreboard
                currentLobby={currentLobby}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                socket={socket}
              />
            </>
          )}

          <Winner
            currentTurn={currentTurn}
            checkoutRound={checkoutRound}
            isCzar={isCzar}
            currentLobby={currentLobby}>
            {isInactive && (
              <div className="errMessage">
                {"You are inactive, you are able to turn back in each stage"}
              </div>
            )}
            {(timerTrigger && isCzar) || (!isCzar && gameStage !== "black") ? (
              <div className="timerContainer">
                <Countdown
                  gameStage={gameStage}
                  timer={timer}
                  setTimer={setTimer}
                  socket={socket}
                  lobbyId={lobbyId}
                  isCzar={isCzar}
                  confirmed={confirmed}
                />
              </div>
            ) : null}
            {currentLobby && (
              <section className="scoreboard-container">
                <Scoreboard
                  currentLobby={currentLobby}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  socket={socket}
                />
              </section>
            )}
          </Winner>
        </>
      ) : (
        <>
          {currentLobby && (
            <section className="scoreboard-container">
              <Scoreboard
                currentLobby={currentLobby}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                socket={socket}
              />
            </section>
          )}

          {isInactive && (
            <div className="errMessage">
              {"You are inactive, you are able to turn back in each stage"}
            </div>
          )}
          {isCzar && blackCards && gameStage === "black" && (
            <Czar
              blackCards={blackCards}
              chooseBlackCard={chooseBlackCard}
              setBlackCards={setBlackCards}
              gameStage={gameStage}
            />
          )}
          {(isCzar && gameStage !== "black") || !isCzar ? (
            <DragAndDropContainer
              data={cardsOnTable}
              setData={setCardsOnTable}
              element={CardTemplate}
              isCzar={isCzar}
              whiteCardChoosed={whiteCardChoosed}
              getNewWhiteCard={getNewWhiteCard}
              setCardsOnTable={setCardsOnTable}
              loading={loading}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              stage={gameStage}
              socket={socket}
              maxHandSize={maxHandSize}>
              {playedWhite && isCzar && (
                <ul className={"cardDisplay playedWhite"}>
                  {playedWhite.map(
                    (cards, index) =>
                      cards.length > 0 && (
                        <li
                          onMouseEnter={() => handleMouseOver(cards)}
                          onMouseLeave={() => handleMouseLeave(cards)}
                          key={cards[0].text + cards[0].pack + index}>
                          {cards.map((card, index) => (
                            <PlayedWhite
                              card={card}
                              key={card.text + "played_card" + index}
                            />
                          ))}
                          <button
                            onClick={() => submitWinner(cards)}
                            className="choose-button"
                            disabled={gameStage === "deciding" ? false : true}>
                            {gameStage === "deciding" ? (
                              <BsFillTrophyFill className="choose-icon" />
                            ) : (
                              <p className="waiting-text">
                                Waiting for all players
                              </p>
                            )}
                          </button>
                        </li>
                      )
                  )}
                </ul>
              )}
            </DragAndDropContainer>
          ) : null}
          {(timerTrigger && isCzar) ||
          (!isCzar && gameStage !== "black" && !confirmed) ? (
            <div className="timerContainer">
              <Countdown
                confirmed={confirmed}
                gameStage={gameStage}
                timer={timer}
                setTimer={setTimer}
                socket={socket}
                lobbyId={lobbyId}
                isCzar={isCzar}
              />
            </div>
          ) : null}

          {showErrMessage && (
            <Error
              showErrMessage={showErrMessage}
              setShowErrMessage={setShowErrMessage}
            />
          )}
        </>
      )}
    </main>
  );
};

export default Game;
