import {
  changeGame,
  createGame,
  sendCurrentGame,
} from "../controller/gameController.js";
import {
  createNewLobby,
  findRoomToJoin,
  setPlayerInactive,
  updateClient,
} from "../controller/socketControllers.js";
import { queue } from "../index.js";

const callbacks = {
  changeGame: changeGame,
  getUpdatedGame: sendCurrentGame,
  createGameObject: createGame,
  disconnect: setPlayerInactive,
  findRoom: findRoomToJoin,
  updateLobby: updateClient,
  createNewLobby: createNewLobby,
};

const useQueue = async (allData) => {
  const { data, channelName, socket, playerId } = allData;
  const { lobbyId } = data;
  // add request from client to queue map
  if (!queue[lobbyId]) {
    queue[lobbyId] = {
      lobby: lobbyId,
      data: [{ states: data, channelName }],
      loading: false,
    };
  } else {
    queue[lobbyId].data.push({ states: data, channelName });
  }

  // execute queue
  if (!queue[lobbyId].loading) {
    queue[lobbyId].loading = true;
    await processQueue({ ...allData });
  }
};

const processQueue = async (allData) => {
  const { data } = allData;
  const { lobbyId } = data;

  // abort loop if request array is empty
  if (queue[lobbyId].data.length === 0 || !queue[lobbyId]) {
    queue[lobbyId].loading = false;
    delete queue[lobbyId];
    return;
  }

  const { states, channelName } = queue[lobbyId].data.shift();

  await callbacks[channelName]({ ...allData, ...states });

  await processQueue(allData);
};

export default useQueue;
