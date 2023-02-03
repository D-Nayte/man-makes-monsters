import GameCollection from "../database/models/game.js";
import LobbyCollection from "../database/models/lobby.js";
import { updateGameInLobby } from "../utils/addGameToLobby.js";
import updateTurn from "../utils/updateTurn.js";
import dealCards from "../utils/dealCardsToPlayers.js";
import { getCache, storeToCache } from "../cache/useCache.js";
import allCards from "../data/index.js";

export const createGame = async ({
  setRounds,
  maxHandSize,
  lobbyId,
  io,
  socket,
  language,
}) => {
  let amountOfRounds = parseInt(setRounds);
  let handSize = parseInt(maxHandSize);
  let languageDeck = allCards[language];

  if (!lobbyId)
    io.to(lobbyId).emit("newgame", {
      err: "Wrong or missng lobby ID",
    });

  //set default if client dos not setup anything
  if (!setRounds) amountOfRounds = 10;
  if (!maxHandSize) handSize = 10;

  try {
    //if alreday games where played, increase the game indentifiyer
    const currentLobbyData = await getCache({ lobbyId });
    const lobby = currentLobbyData.currentLobby;
    let currentGameIndex = lobby.games.length;

    if (!lobby)
      return socket.to(lobbyId).emit("newgame", { err: "Can not find lobby" });

    // add each ACTIVE players wich are INSIDE lobby all necessary keys
    lobby.waiting = lobby.waiting.filter(
      (waitPlayer) =>
        !lobby.players.find((player) => player.id === waitPlayer.id)
    );
    const allPlayers = lobby.waiting
      .filter((player) => !player.inactive)
      .map((player) => {
        const newPLayer = { ...player };
        newPLayer.points = 0;
        newPLayer.hand = [];
        newPLayer.bet = false;
        newPLayer.inactive = false;
        return newPLayer;
      });

    if (allPlayers.length <= 2)
      return io.to(socket.id).emit("newgame", {
        err: "Please wait for at least 2 waiting Players",
      });

    lobby.players = [...allPlayers];
    await storeToCache({ lobbyId, currentLobby: lobby });
    LobbyCollection.findByIdAndUpdate(lobbyId, lobby).exec();

    const [black] = languageDeck.map((set) => set.black);
    const [white] = languageDeck.map((set) => set.white);

    const gamedata = {
      id: lobbyId,
      setRounds: amountOfRounds,
      gameIdentifier: currentGameIndex,
      handSize: handSize,
      concluded: false,
      players: [...allPlayers],
      deck: {
        black_cards: [...black],
        white_cards: [...white],
      },
      turns: [
        {
          turn: 0,
          czar: null,
          stage: ["start"],
          white_cards: [],
          black_card: {},
          winner: {},
          completed: [],
        },
      ],
      timerTrigger: false,
    };
    io.to(lobbyId).emit("newgame", { newGameData: gamedata });
    await storeToCache({ lobbyId, currentGame: gamedata });
    GameCollection.create(gamedata);
  } catch (error) {
    console.error(error);
    io.to(lobbyId).emit("newgame", {
      err: "Can not create new Game, please host a new one",
    });
  }
};

export const sendCurrentGame = async (data) => {
  const { lobbyId, id, io, socket } = data;
  if (!lobbyId || !id)
    return io.to(socket.id).emit("currentGame", { err: "Missing Lobby ID " });

  socket.userId = id;
  //join socket after disconnect
  socket.join(lobbyId);
  try {
    const currentLobbyData = await getCache({ lobbyId });
    const { currentGame, currentLobby } = currentLobbyData;
    const currentTurnIndex = currentGame.turns.length - 1;
    if (currentTurnIndex < 0) currentTurnIndex = 0;
    const czar = currentGame.turns[currentTurnIndex]?.czar;

    //if no czar, asign new one
    if (!czar) {
      const currentTurn = currentGame.turns[currentTurnIndex];
      const newCzar = currentGame.players.find((player) => !player.inactive);
      currentTurn.czar = newCzar;
      currentTurn.white_cards.filter((player) => player.player !== newCzar.id);
    }

    //if cant find loby, send error back
    if (!currentGame)
      return io
        .to(socket.id)
        .emit("currentGame", { err: "Cant find a running game" });

    // find current game by lobby id and gameidentifyer from lobby games array
    const foundPLayer = currentGame.players.find((player) => player.id === id);

    //if no player leaves or joines, just update the current client/player
    if (foundPLayer && foundPLayer.inactive === false) {
      io.to(socket.id).emit("currentGame", { currentGame });
      await storeToCache({ lobbyId, currentGame });
      GameCollection.findOneAndUpdate(
        {
          id: lobbyId,
          gameIdentifier: currentGame.gameIdentifier,
        },
        currentGame
      ).exec();
      return;
    }
    //if player rejoins, update everyone
    currentGame.players = currentGame.players.map((player) => {
      if (player.id === id) player.inactive = false;
      return player;
    });

    io.to(lobbyId).emit("currentGame", { currentGame });
    await storeToCache({ lobbyId, currentGame });
    GameCollection.findOneAndUpdate(
      {
        id: lobbyId,
        gameIdentifier: currentGame.gameIdentifier,
      },
      currentGame
    ).exec();
  } catch (error) {
    console.error(error);
    io.to(socket.id).emit("currentGame", {
      err: "Invalid lobby code or no running game",
    });
  }
};

export const changeGame = async (states) => {
  const { playerId, stage, gameId, lobbyId, io } = states;
  if (stage === "dealing") {
    try {
      const currentLobbyData = await getCache({ lobbyId });
      const { currentGame } = currentLobbyData;
      const gameIdentifier = currentGame.gameIdentifier;
      const updatedGame = dealCards({ currentGame, playerId });

      io.to(lobbyId).emit("currentGame", { currentGame: updatedGame });
      await storeToCache({ lobbyId, currentGame: updatedGame });
      GameCollection.findOneAndUpdate(
        {
          id: lobbyId,
          gameIdentifier: gameIdentifier,
        },
        updatedGame
      ).exec();
      return;
    } catch (error) {
      io.to(lobbyId).emit("currentGame", {
        err: "Can't update Game, please create a new one",
      });
      return;
    }
  }

  //change current turn
  try {
    const currentLobbyData = await getCache({ lobbyId });
    const { currentGame } = currentLobbyData;
    const gameIdentifier = currentGame?.gameIdentifier;
    const updatedGame = await updateTurn({ ...states, currentGame });
    if (!updatedGame) return "Server error, no game found";

    io.to(lobbyId).emit("currentGame", {
      currentGame: updatedGame,
      kicked: updatedGame.kicked,
      changeAvatar: updatedGame.changeAvatar,
    });
    if (updatedGame.kicked) delete updatedGame.kicked;
    if (updatedGame.changeAvatar) delete updatedGame.changeAvatar;

    //if game is finished, store into lobby/games
    // if (updatedGame.concluded) await updateGameInLobby(updatedGame);
    await updateGameInLobby(updatedGame);
    await storeToCache({ lobbyId, currentGame: updatedGame });
    GameCollection.findOneAndUpdate(
      {
        id: lobbyId,
        gameIdentifier: gameIdentifier,
      },
      updatedGame
    ).exec();
    return;
  } catch (error) {
    console.error("error", error);
    io.to(lobbyId).emit("currentGame", {
      err: "Server error, cant find game",
    });
  }
};
