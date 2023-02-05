import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";
import randomName from "../utils/randomName.js";
import {
  getCache,
  getLobbyIdFromCache,
  storeToCache,
} from "../cache/useCache.js";

export const createNewLobby = async (data) => {
  const { hostName, id, socket } = data;
  const lobby = {
    games: [],
    waiting: [{ name: hostName, id, isHost: true, inactive: false, points: 0 }],
    players: [],
  };
  try {
    const newLobby = await LobbyCollection.create({
      ...lobby,
    });
    const lobbyId = newLobby._id.toString();
    await storeToCache({ lobbyId, currentLobby: newLobby });

    socket.emit("LobbyCreated", { lobbyId, hostName });
    socket.join(lobbyId);
  } catch (err) {
    socket.emit("error", { err });
  }
};

export const findRoomToJoin = async ({
  lobbyId,
  newPlayerName,
  socket,
  id,
  io,
}) => {
  const player = { name: newPlayerName, id, inactive: false, isHost: false };

  // searche game in MongoDb
  try {
    const { currentLobby } = await getCache({ lobbyId });

    // update player list in DB
    currentLobby.waiting.push(player);

    //join player into room and send lobbyId back
    socket.join(lobbyId);
    socket.emit("foundRoom", {
      noRoom: false,
      lobbyId,
      playerName: newPlayerName,
    });

    //updateing room
    io.to(lobbyId).emit("updateRoom", { currentLobby });
    await storeToCache({ lobbyId, currentLobby });
  } catch (error) {
    return socket.emit("foundRoom", {
      noRoom: true,
      err: "Can't find game",
    });
  }
};

export const updateClient = async (data) => {
  const { lobbyId, socket, joinGame, id, io, newPLayerName, avatar } = data;
  if (!lobbyId || !id)
    return socket.emit("updateRoom", {
      err: "Cant find game to join. Wrong lobby id or player id",
    });

  try {
    const { currentLobby } = await getCache({ lobbyId });
    if (!currentLobby) throw Error();

    const foundPLayer = currentLobby.waiting.find((player) => player.id === id);
    // delete players from lobby.players ONLY if to avatars requests for update to be available for a game rejoining  lobby
    if (!avatar)
      currentLobby.players = currentLobby.players.filter(
        (currPlayer) => currPlayer.id !== id
      );

    if (newPLayerName) foundPLayer.name = newPLayerName;

    if (foundPLayer) {
      foundPLayer.inactive = false;
      foundPLayer.avatar = avatar && avatar;
      const playerIndex = currentLobby.waiting.findIndex(
        (player) => player.id === id
      );
      if (playerIndex === 0) {
        foundPLayer.isHost = true;
        //change alle other player to be not the host
        currentLobby.waiting = currentLobby.waiting.map((player, index) => {
          if (index === 0) return player;
          player.isHost = false;
          return player;
        });
      }
    }

    // join new player after using invitation link
    if (!foundPLayer && joinGame) {
      if (currentLobby.waiting.length + currentLobby.players.length === 10) {
        return io.to(socket.id).emit("updateRoom", {
          err: "Maximun amount of 10 players reached",
        });
      }
      const newPLayer = {
        id,
        isHost: false,
        inactive: false,
        name: randomName(),
        points: 0,
      };
      currentLobby.waiting.push(newPLayer);
    }

    io.to(lobbyId).emit("updateRoom", {
      currentLobby,
    });

    await storeToCache({ lobbyId, currentLobby });

    LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
  } catch (err) {
    console.error(err);
    socket.emit("updateRoom", {
      err: "cant update Client",
    });
  }
};

export const setPlayerInactive = async ({ io, userId }) => {
  //set player inactive on disconnect
  try {
    const lobbyId = getLobbyIdFromCache({ userId });
    const currentLobbyData = await getCache({ lobbyId });
    const { currentLobby, currentGame } = currentLobbyData;
    if (!currentLobby)
      return console.error("No lobby found to delete player from");

    //set leaving player inactive if they are in a running game
    if (currentGame) {
      const currentTurn = currentGame.turns[currentGame.turns.length - 1];
      const currenCzar = currentTurn?.czar;
      currentGame.players = currentGame.players.map((player) => {
        if (player.id === userId) player.inactive = true;
        return player;
      });

      // if czar leaves, assign a new one
      if (currenCzar?.id === userId) {
        currentTurn.czar = currentGame.players.find(
          (player) => !player.inactive
        );
        //reset the current turn and start with a new czar
        currentTurn.stage = ["start", "dealing", "black"];
        currentTurn.white_cards = currentTurn.white_cards.map((player) => ({
          ...player,
          played_card: [],
        }));
        currentTurn.black_card = null;
      }
      io.to(lobbyId).emit("currentGame", { currentGame });

      await storeToCache({ lobbyId, currentGame });
      GameCollection.findOneAndUpdate(
        {
          id: lobbyId,
          gameIdentifier: currentGame.gameIdentifier,
        },
        currentGame
      ).exec();
    }

    //search for player that needs to be set inactive from lobby
    currentLobby.waiting = currentLobby.waiting.map((player) => {
      if (player.id === userId) player.inactive = true;
      if (player.isHost) player.isHost = false;
      return player;
    });

    //find actuall host
    let findHost = currentLobby.waiting.find((player) => {
      return player.isHost && !player.inactive;
    });

    //if no host inside game, make the next Player to host
    if (!findHost) {
      const activePlayerIndex = currentLobby.waiting.findIndex(
        (player) => !player.inactive
      );
      if (activePlayerIndex >= 0) {
        currentLobby.waiting[activePlayerIndex].isHost = true;
        findHost = currentLobby.waiting[activePlayerIndex];
      }
    }
    await storeToCache({ lobbyId, currentLobby });

    LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();

    if (lobbyId) io.to(lobbyId).emit("updateRoom", { currentLobby });
  } catch (error) {
    console.error("Error while removing player on disconnect", error);
    return { err: "Cant find player to remove" };
  }
};
