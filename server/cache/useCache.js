import NodeCache from "node-cache";
import LobbyCollection from "../database/models/lobby.js";
import GameCollection from "../database/models/game.js";

//stdTTL = livetime, this will delte data after 48h
export const serverCache = new NodeCache({ stdTTL: 86400 });

export const storeToCache = async ({ lobbyId, currentLobby, currentGame }) => {
  let currentLobbyData = await getCache({ lobbyId });

  if (!lobbyId) return console.error("no lobby ID!");

  currentLobby && (currentLobbyData.currentLobby = currentLobby);
  currentGame && (currentLobbyData.currentGame = currentGame);

  // store user id combared to lobbyID
  if (currentLobbyData.currentLobby)
    currentLobbyData.currentLobby.waiting.forEach((player) =>
      serverCache.set(player.id, currentLobbyData.currentLobby._id)
    );
  const success = serverCache.set(lobbyId, JSON.stringify(currentLobbyData));
  if (!success) return console.error("Store to cache failed!");
  return currentLobbyData;
};

export const getCache = async ({ lobbyId }) => {
  if (!lobbyId || typeof lobbyId !== "string")
    return console.error("no valid lobbyId to searche for in 'getCache'");

  let currentLobbyData = await serverCache.get(lobbyId);

  if (!currentLobbyData) {
    const lobbyFromDB = await LobbyCollection.findById(lobbyId);
    const gameIdent =
      lobbyFromDB.games.length - 1 >= 0 ? lobbyFromDB.games.length - 1 : 0;
    const gameFromDb = await GameCollection.findOne({
      id: lobbyId,
      gameIdentifier: gameIdent,
    });
    const currentLobbyData = {
      currentLobby: lobbyFromDB ? lobbyFromDB : null,
      currentGame: gameFromDb ? gameFromDb : null,
    };

    const success = serverCache.set(lobbyId, JSON.stringify(currentLobbyData));
    if (!success) return console.error("Store to cache failed!");

    return currentLobbyData;
  }
  return JSON.parse(currentLobbyData);
};

export const getLobbyIdFromCache = ({ userId }) => {
  if (!userId) return console.error("no userId to search for lobby id");
  const lobbyId = serverCache.take(userId);
  if (!lobbyId)
    return console.error("cand find lobby id in 'getLobbyIdFromCache");
  return lobbyId;
};

export const cachUser = ({ id, socketId }) => {
  if (!id) return serverCache.set(socketId, socketId);
  serverCache.set(socketId, id);
};

export const getCachedUser = ({ socketId }) => {
  const userId = serverCache.take(socketId);
  if (!userId) return console.error("No user id found!");
  return userId;
};
