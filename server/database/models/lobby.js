import mongoose from "mongoose";
import deleteOutatedData from "../../utils/deleteOutatedData.js";

const lobbyModel = mongoose.Schema(
  {
    games: [{ type: Object, index: true }],
    players: [
      {
        id: String,
        name: String,
        isHost: false,
        inactive: false,
        points: Number,
        avatar: Object,
      },
    ],
    waiting: [
      {
        id: String,
        name: String,
        isHost: false,
        inactive: false,
        points: Number,
        avatar: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LobbyCollection = mongoose.model("LobbyCollection", lobbyModel);

deleteOutatedData(LobbyCollection);

export default LobbyCollection;
