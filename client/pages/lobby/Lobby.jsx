import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { RiVipCrown2Fill } from "react-icons/ri";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { motion as m } from "framer-motion";
import randomInsult from "../../utils/randomInsult";
import Error from "../../components/Error";
import Scoreboard from "../../components/Scoreboard";
import { parseCookies } from "nookies";
import Loading from "../../components/Loading";
import PageNotFound from "../../components/PageNotFound";
import { useAppContext } from "../../context";
import { TfiRocket } from "react-icons/tfi";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { notTheHostSteps, Steps } from "../../components/Steps.js";
import useLocalStorage from "../../components/useLocalStorage";
import { AiOutlineEnter } from "react-icons/ai";
import { VscDebugDisconnect } from "react-icons/vsc";

const Lobby = (props) => {
  const { socket, handSize, amountOfRounds, language } = props;

  if (!socket)
    return (
      <main>
        <Loading />
      </main>
    );

  const router = useRouter();
  const [joinGame, setJoinGame] = useState(null);
  const cookies = parseCookies();
  const [showErrMessage, setShowErrMessage] = useState(null);
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isHost, setHost] = useState(false);
  const [linkInvation, setlinkInvation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [reconnect, setReconnect] = useState(false);
  const [currentLobby, setCurrentLobby] = useState(null);
  const [listenersReady, setListenersReady] = useState(false);
  const [useJoyRide, setuseJoyRide] = useState(false);
  let [value, setValue] = useLocalStorage("tutorial");
  const [stepIndex, setStepIndex] = useState(0);
  const { storeData, setStoreData } = useAppContext();
  const lobbyId = storeData.lobbyId;

  const handleGameCreation = () => {
    setIsloading(true);
    socket.emit("createGameObject", {
      lobbyId,
      setRounds: amountOfRounds,
      maxHandSize: handSize,
      language,
    });
  };

  const changePLayerName = (newPLayerName) => {
    socket.emit("updateLobby", {
      lobbyId,
      id: cookies.socketId,
      newPLayerName,
    });
  };

  function calculateFontSize(name) {
    return 26 - name.length + "px";
  }

  const checkIfPlaying = (playerId) => {
    return currentLobby.players.find((player) => player.id === playerId);
  };

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if (
      stepIndex !== 3 &&
      [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)
    ) {
      // Update state to advance the tour
      setStepIndex((prev) => (prev += 1));
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setIsOpen(true);
      setTimeout(() => {
        setStepIndex((prev) => (prev += 1));
      }, 300);
    }
    if (stepIndex === 6) {
      setIsOpen(false);
    }
    if (index >= Steps.length - 1) {
      setTimeout(() => {
        setValue("DONE");
      }, 10000);
    }
  };

  useEffect(() => {
    if (cookies.socketId && lobbyId) {
      socket.on("updateRoom", ({ currentLobby, err, kicked }) => {
        if (!currentLobby || err) {
          setIsloading(false);
          return setShowErrMessage(
            err ? err : "Can not find Lobby, please check our invatation link"
          );
        }
        const player = currentLobby.waiting.find(
          (player) => player.id === cookies.socketId
        );
        //if player got kicket
        if (kicked && !player)
          return (
            setShowErrMessage("You got kicked! Redirecting you back"),
            setTimeout(() => {
              router.push("/");
            }, 5500)
          );

        setIsloading(false);
        setCurrentLobby(currentLobby);

        if (!player) {
          setCurrentLobby(null);
          return setShowErrMessage("Player not found");
        }
        const { waiting } = currentLobby;
        const { id, name, isHost, inactive } = player;
        //check if the host
        isHost
          ? (setHost(true), setStoreData((prev) => ({ ...prev, isHost: true })))
          : setHost(false);

        if (err) return console.warn(err);

        setPlayers((pre) => waiting);
      });

      // creates new game if host and redirect everyone to game
      socket.on("newgame", ({ newGameData, err }) => {
        if (!newGameData || err) {
          setIsloading(false);
          return setShowErrMessage(err);
        }
        const stage = newGameData.turns[0].stage[0];
        const gameId = newGameData.gameIdentifier;
        if (lobbyId) {
          if (stage === "start") {
            let gamePath = {
              pathname: `/lobby/game/${gameId}`,
              query: { lobbyId: lobbyId },
            };
            router.push(gamePath);
          }
        }
      });
      setListenersReady(true);
    }
    return () => {
      socket.removeAllListeners();
      setListenersReady(false);
    };
  }, [cookies.socketId, lobbyId, joinGame, reconnect, socket]);

  useEffect(() => {
    //self update page after got redirected, use key from query as lobby id
    if (listenersReady) {
      socket.emit("updateLobby", { lobbyId, id: cookies.socketId, joinGame });
    }
  }, [listenersReady]);

  useEffect(() => {
    if (currentLobby) {
      //activate tutorial after lobby is successfully loaded
      setTimeout(() => {
        setuseJoyRide(true);
      }, 1000);
    }
  }, [currentLobby]);

  useEffect(() => {
    setJoinGame(router.query.joinGame);
    if (router.query.lobbyId) {
      setlinkInvation(`${window?.location.href}?joinGame=true`);
      setStoreData((prev) => ({ ...prev, lobbyId: router.query.lobbyId[0] }));
      socket.io.on("reconnect", () => {
        setListenersReady(false);
        setReconnect((prev) => !prev);
      });
    }
  }, [router.isReady]);

  //hello David :) WE good at naming conventions😘😘
  const toggleSomething = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (isLoading && !currentLobby)
    return (
      <main>
        <Loading />
      </main>
    );

  if (!currentLobby)
    return (
      <main>
        {showErrMessage && (
          <Error
            showErrMessage={showErrMessage}
            setShowErrMessage={setShowErrMessage}
          />
        )}
        <PageNotFound />
      </main>
    );

  return (
    <>
      {isHost ? (
        <JoyRide
          callback={handleJoyrideCallback}
          continuous
          stepIndex={stepIndex}
          hideCloseButton
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={Steps}
          run={value == "DONE" ? false : useJoyRide}
        />
      ) : (
        <JoyRide
          callback={handleJoyrideCallback}
          continuous
          stepIndex={stepIndex}
          hideCloseButton
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={notTheHostSteps}
          run={value == "DONE" ? false : useJoyRide}
        />
      )}
      <main className="waitingLobbyContainer">
        {currentLobby && (
          <section className="scoreboard-container">
            <Scoreboard
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currentLobby={currentLobby}
              socket={socket}
            />
          </section>
        )}

        <section className="waitingLobbyCard">
          <m.div
            className="framerContainer"
            initial={{ y: -500, rotate: -30 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{
              x: -1300,
              rotate: -120,
              transition: { duration: 0.75 },
            }}>
            <h1>
              Waiting for players&nbsp;
              <span className="loadingContainer">
                <div className="loader">
                  <div className="circle" id="a" />
                  <div className="circle" id="b" />
                  <div className="circle" id="c" />
                </div>
              </span>
            </h1>

            {isHost && (
              <div className="lobbyIdContainer">
                <h3>Invite your Friends: </h3>
                <div className="lobbyIdCopyField">
                  {copied ? (
                    <p className="tempCopyText">Copied to clipboard!</p>
                  ) : null}
                  <CopyToClipboard text={linkInvation} onCopy={toggleSomething}>
                    <div className="input-icon-wrapper">
                      <p>Click to copy invitation link</p>
                      <BiCopy className="icon" />
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            )}
            <div className="inputEnterIconContainer">
              <input
                maxLength={15}
                className="changeNameButton"
                type="text"
                onClick={(e) => changePLayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    changePLayerName(e.target.value);
                  }
                }}
                placeholder="Change name"
              />
              <AiOutlineEnter className="enterIcon" />
            </div>

            {isHost && (
              <button
                className={
                  isLoading
                    ? "waitingLobbyButton isLoading"
                    : "waitingLobbyButton"
                }
                onClick={handleGameCreation}
                disabled={isLoading ? true : false}
                style={
                  isLoading
                    ? {
                        transform: "scale(1)",
                      }
                    : null
                }>
                <span>{isLoading ? "Loading..." : "Start Game"}</span>
              </button>
            )}
          </m.div>
          <ul className="dragContainer">
            {players &&
              players.map((player, index) => (
                <li
                  key={player.name + index}
                  className={
                    player.inactive || checkIfPlaying(player.id)
                      ? "inactive"
                      : null
                  }>
                  <h2 style={{ fontSize: `${calculateFontSize(player.name)}` }}>
                    {player.name.toUpperCase() !== "DAVID" ? (
                      player.name.toUpperCase()
                    ) : (
                      <>
                        <TfiRocket className="rockt" />
                      </>
                    )}
                  </h2>
                  {player.inactive && (
                    <>
                      <VscDebugDisconnect className="disconectIcon" />
                      <p className="disconnectText">
                        Lost Connection: {randomInsult()}
                      </p>
                    </>
                  )}
                  {checkIfPlaying(player.id) && <p>Currently in a Game...</p>}
                  {player.isHost && (
                    <div className="hostCrown">
                      <RiVipCrown2Fill />
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </section>
        {showErrMessage && (
          <Error
            showErrMessage={showErrMessage}
            setShowErrMessage={setShowErrMessage}
          />
        )}
      </main>
    </>
  );
};

export default Lobby;
