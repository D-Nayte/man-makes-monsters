import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import useQueue from "./utils/useQueue.js";
import consoleSuccess from "./utils/consoleSuccess.js";
import { cachUser, getCachedUser } from "./cache/useCache.js";

dotenv.config();
connectDB(process.env.DB_URI);

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

export const queue = {};
const PORT = process.env.PORT || 5555;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, async (req, res) => {
  consoleSuccess(`Server running under ${PORT}`);
});

//Socket.io
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("cachUser", ({ cookieId }) => {
    cachUser({ id: cookieId, socketId: socket.id });
  });

  socket.on("createNewLobby", (data) => {
    socket.join(data.lobbyId);
    useQueue({ data, socket, io, channelName: "createNewLobby" });
  });

  socket.on("updateLobby", (data) => {
    socket.join(data.lobbyId), (socket.userId = data.playerId);
    useQueue({ data, socket, io, channelName: "updateLobby" });
  });

  socket.on("findRoom", (data) => {
    socket.join(data.lobbyId), (socket.userId = data.playerId);
    useQueue({ data, socket, io, channelName: "findRoom" });
  });

  socket.on("disconnect", async (reason) => {
    let userId = getCachedUser({ socketId: socket.id });
    if (!userId) return;

    useQueue({
      userId,
      io,
      channelName: "disconnect",
      data: { lobbyId: reason.replace(" ", "") },
    });
  });

  socket.on("createGameObject", (data) => {
    socket.join(data.lobbyId);
    useQueue({ data, socket, io, channelName: "createGameObject" });
  });

  socket.on("getUpdatedGame", (data) => {
    socket.join(data.lobbyId);
    useQueue({ data, socket, io, channelName: "getUpdatedGame" });
  });

  socket.on("changeGame", async (data) => {
    socket.join(data.lobbyId),
      useQueue({ data, socket, io, channelName: "changeGame" });
  });

  socket.on("sendTimer", ({ lobbyId, requestSync, timer }) => {
    socket.join(lobbyId);
    io.to(lobbyId).emit("getTimer", {
      timer,
      requestSync,
    });
  });
});
