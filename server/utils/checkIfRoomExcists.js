import GameCollection from "../database/models/game.js";
import { generateRoomCode } from "./roomCodeGenerator.js";

export const checkRooms = async () => {
  const randomRoomCode = generateRoomCode();

  //check if room already excists
  const roomExcists = await GameCollection.findOne({ roomId: randomRoomCode });

  if (roomExcists) checkRooms();
  if (!roomExcists) return randomRoomCode;
};
