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

export default processQueue;
