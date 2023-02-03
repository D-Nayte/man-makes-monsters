import { getCache, storeToCache } from "../cache/useCache.js";
import LobbyCollection from "../database/models/lobby.js";

export const updateGameInLobby = async (game) => {
  const lobbyId = game.id;
  const currentLobbyData = await getCache({ lobbyId });
  const { currentLobby } = currentLobbyData;
  let currentGameIndex = currentLobby.games.length - 1;

  if (currentGameIndex < 0) currentGameIndex = 0;

  if (currentLobby.games[currentGameIndex]?.concluded) {
    const copyedGame = {
      id: game.id,
      gameIdentifier: game.gameIdentifier,
      players: game.players,
      concluded: game.concluded,
    };

    currentLobby.games.push(copyedGame);
    //add points to player
    currentLobby.waiting = currentLobby.waiting.map((currPlayer) => {
      let points = 0;
      currentLobby.games.forEach((game) => {
        const oldPlayer = game.players.find(
          (player) => player.id === currPlayer.id
        );
        if (!oldPlayer) return;
        points += oldPlayer.points;
      });
      return { ...currPlayer, points };
    });

    await storeToCache({ lobbyId, currentLobby });
    return LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
  }

  const copyedGame = {
    id: game.id,
    gameIdentifier: game.gameIdentifier,
    players: game.players,
    concluded: game.concluded,
  };

  currentLobby.games[currentGameIndex] = copyedGame;

  //add points to player
  currentLobby.waiting = currentLobby.waiting.map((currPlayer) => {
    let points = 0;
    currentLobby.games.forEach((game) => {
      const oldPlayer = game.players.find(
        (player) => player.id === currPlayer.id
      );
      if (!oldPlayer) return;
      points += oldPlayer.points;
    });
    return { ...currPlayer, points };
  });

  await storeToCache({ lobbyId, currentLobby });
  return LobbyCollection.findByIdAndUpdate(lobbyId, currentLobby).exec();
};
