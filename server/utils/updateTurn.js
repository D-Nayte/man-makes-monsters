import { getCache, storeToCache } from "../cache/useCache.js";
import LobbyCollection from "../database/models/lobby.js";

const updateTurn = async ({
  currentGame,
  playedBlack,
  stage,
  playerId,
  blackCards,
  playedWhite,
  winningCards,
  leavedGame,
  sendWhiteCards,
  socket,
  io,
  closeGame,
  kickPlayer,
  lobbyId,
  changeAvatar,
  avatar,
}) => {
  let currentTurnIndex = currentGame?.turns?.length - 1;
  if (currentTurnIndex < 0 || !currentTurnIndex) currentTurnIndex = 0;
  const currentTurn = currentGame ? currentGame?.turns[currentTurnIndex] : null;

  //reactivate each player after they really played
  if (!leavedGame && currentGame) {
    currentGame.players = currentGame.players.map((player) => {
      if (player.id === playerId) player.inactive = false;
      return player;
    });
  }

  //if just avatar gotes changed
  if (changeAvatar) {
    currentGame.players = currentGame.players.map((player) => {
      if (player.id === playerId) player.avatar = avatar;

      return player;
    });
    return { ...currentGame, changeAvatar: playerId };
  }

  //kick player
  if (kickPlayer) {
    //kick player from Lobby
    const currentLobbyData = await getCache({ lobbyId });
    const { currentLobby } = currentLobbyData;
    currentLobby.players = currentLobby.players.filter(
      (player) => player.id !== playerId
    );
    currentLobby.waiting = currentLobby.waiting.filter(
      (player) => player.id !== playerId
    );
    io.to(lobbyId).emit("updateRoom", { currentLobby, kicked: true });
    await storeToCache({ lobbyId, currentLobby });
    LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();

    //kick player from game if played one
    if (currentGame) {
      currentGame.players = currentGame.players.filter(
        (player) => player.id !== playerId
      );
      //if czar was kicked assign a new one
      const czar = currentTurn.czar;

      if (czar.id === playerId) {
        currentTurn.czar = currentGame.players.find(
          (player) => !player.inactive
        );
        currentTurn.stage = ["start", "dealing", "black"];
        currentTurn.black_card = null;
        return { ...currentGame, kicked: true };
      }

      currentTurn.white_cards = currentTurn.white_cards.filter(
        (player) => player.player !== playerId
      );
    }
    return { ...currentGame, kicked: true };
  }

  //if player closes the game
  if (closeGame) {
    currentGame.concluded = true;

    return currentGame;
  }

  // set status to inactive if playver turns back to lobby
  if (leavedGame) {
    const currentCzar = currentTurn.czar;
    const currentHost = currentGame.players.find((player) => player.isHost);
    const currentPlayer = currentGame.players.find(
      (curr) => curr.id === playerId
    );
    //if normal player leaves running Game, set inactive in Game.players
    if (currentPlayer) {
      currentPlayer.inactive = true;
    }

    //if hoste leave, assign a new one
    if (currentHost.id === currentPlayer.id) currentHost.isHost = false;
    const newHost = currentGame.players.find(
      (player) => player.id !== currentHost.id
    );
    newHost.isHost = true;

    //if czar leaves, asign a new czar and restart round
    if (currentCzar.id === currentPlayer.id) {
      //asign new czar
      const activePlayers = currentGame.players.filter(
        (player) => !player.inactive
      );
      const randomIndex = Math.floor(
        Math.random() * (activePlayers.length - 1)
      );
      const newCzar = activePlayers[randomIndex];
      currentTurn.czar = newCzar;

      //remove new czar from white_cards
      currentTurn.white_cards = currentTurn.white_cards.filter(
        (player) => player.player !== newCzar.id
      );

      // add old czar to white_cards for next turns
      currentTurn.white_cards.push({
        player: currentCzar.id,
        cards: currentCzar.hand,
        played_card: [],
        points: currentCzar.points,
      });

      //give players cards back to hand AND to cards in "white_cards"
      currentGame.players = currentGame.players.map((player) => {
        const playedCards = currentTurn.white_cards.find(
          (currPlayer) => currPlayer.player === player.id
        )?.played_card;
        if (playedCards)
          return { ...player, hand: [...player.hand, ...playedCards] };
        return player;
      });
      currentTurn.white_cards = currentTurn.white_cards.map((player) => {
        const playedWhite = player.played_card;
        return {
          ...player,
          cards: [...player.cards, ...playedWhite],
          played_card: [],
        };
      });

      //restart round
      currentTurn.stage = ["start", "dealing", "black"];
      currentTurn.black_card = null;
      return { ...currentGame };
    }
  }

  // if user requests for a new white card
  if (sendWhiteCards) {
    const randomIndex =
      Math.random() * (currentGame.deck.white_cards.length - 1);
    const [newWhite] = currentGame.deck.white_cards.splice(randomIndex, 1);
    currentTurn.white_cards = currentTurn.white_cards.map((player) => {
      if (player.player === playerId) player.cards.push(newWhite);
      return player;
    });
    currentGame.players = currentGame.players.map((player) => {
      if (player.id === playerId) player.hand.push(newWhite);
      return player;
    });
    io.to(socket.id).emit("newWhiteCard", { newWhite });
    await storeToCache({ lobbyId, currentGame });
    return;
  }

  // send every player the choosen black card
  if (stage === "black") {
    currentGame.deck.black_cards = blackCards;
    currentTurn.stage = [...currentTurn.stage, "white"];
    currentTurn.black_card = playedBlack;
    return currentGame;
  }

  //send czar choosed white cards from player
  if (stage === "white") {
    const currentPlayer = currentGame.players.find(
      (curr) => curr.id === playerId
    );
    const updatedHand = currentPlayer.hand.filter(
      (card) => !playedWhite.find((whiteCard) => whiteCard.text === card.text)
    );

    //update player in game object
    currentPlayer.hand = updatedHand;
    const updatedPlayer = {
      player: currentPlayer.id,
      cards: updatedHand,
      played_card: playedWhite,
      points: 0,
    };

    //update player in turns.white_cards
    currentTurn.white_cards = currentTurn.white_cards.map((player) => {
      if (player.player === playerId) return updatedPlayer;
      return player;
    });

    //check if every active player submitted their cards by lookin into white_cards/played_cards
    const currentCzarId = currentTurn.czar.id;
    const activePlayers = currentGame.players.filter(
      (player) => !player.inactive && player.id !== currentCzarId
    );
    const allPlayedCards = currentTurn.white_cards
      .filter(
        (player) =>
          player.player ===
            activePlayers.find(
              (foundPlayer) => foundPlayer.id === player.player
            )?.id && player.played_card.length > 0
      )
      .map((player) => player.played_card);

    if (allPlayedCards.length === activePlayers.length)
      currentTurn.stage.push("deciding");

    return currentGame;
  }

  //send winner to players
  if (stage === "winner") {
    // currentGame;
    const wonPlayer = currentTurn.white_cards
      .filter((player) => player.played_card.length > 0)
      .find((player) => player.played_card[0].text === winningCards[0].text);

    //add points to turn
    wonPlayer.played_card.forEach((card) => (wonPlayer.points += 10));
    currentTurn.winner = wonPlayer;
    //add points to global players
    currentGame.players.map((player) => {
      if (player.id === wonPlayer.player) player.points += wonPlayer.points;
      return player;
    });
    currentTurn.stage.push("winner");
    return currentGame;
  }

  if (stage === "completed") {
    const Game = currentGame;
    currentTurn.completed.push(
      Game.players.find((player) => player.id === playerId)
    );
    //if every active player is ready, creat new turn
    if (
      currentTurn.completed.length >=
      Game.players.filter((player) => !player.inactive).length
    ) {
      //if max rounds reached, close game
      if (currentGame.turns.length === currentGame.setRounds) {
        currentGame.concluded = true;
        return currentGame;
      }

      const currCzarIndex = Game.players
        .filter((player) => !player.inactive)
        .indexOf(
          Game.players.find((player) => player.id === currentTurn.czar.id)
        );
      const lastPlayerIndex =
        Game.players.filter((player) => !player.inactive).length - 1;
      //if czar is the last palyer in an array, take the first player
      const nextCzar =
        currCzarIndex === lastPlayerIndex
          ? Game.players.find((player) => !player.inactive)
          : Game.players.find(
              (player, index) => !player.inactive && index === currCzarIndex + 1
            );

      // create a new turn
      const newTurn = {
        turn: currentTurn.turn + 1,
        czar: nextCzar,
        stage: ["start", "dealing", "black"],
        white_cards: Game.players
          // .filter((player) => player.id !== nextCzar.id && !player.inactive)
          .filter((player) => player.id !== nextCzar.id)
          .map((player) => {
            return {
              player: player.id,
              cards: player.hand,
              played_card: [],
              points: player.points,
            };
          }),
        black_card: {},
        winner: {},
        completed: [],
      };
      currentGame.turns.push(newTurn);
    }
    return currentGame;
  }
  return currentGame;
};

export default updateTurn;
