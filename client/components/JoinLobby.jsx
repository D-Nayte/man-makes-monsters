import useLocalStorage from "./useLocalStorage";
import React, { useEffect, useRef, useState } from "react";
import { parseCookies } from "nookies";

//Join a game
const JoinGame = ({ roomKey, playerName, socket, setShowErrMessage }) => {
  let [value, setValue] = useLocalStorage("name", "");
  let [noButtonAtAll, setNoButtonAtAll] = useState(true);
  let [roomCode, setRoomeCode] = useState("");
  const cookies = parseCookies();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(setNoButtonAtAll(true), 2500);

    if (roomCode && noButtonAtAll) {
      // get values from form
      noButtonAtAll = false;

      const lobbyId = roomCode;
      const newPlayerName = playerName.current.value;
      const id = cookies.socketId;

      // request to server to find the game by the given id from form
      socket.emit("findRoom", { lobbyId, newPlayerName, id });
    }
  };

  // pull code from URL
  const displayRoomCode = (url) => {
    const startIndex = url.indexOf("lobby") + 6;
    const endIndex = url.indexOf("?");
    const roomCode = url.slice(startIndex, endIndex);
    if (url.length <= 50) {
      setShowErrMessage("Wrong code. Check your link");
      return setRoomeCode("PASTE your code");
    }

    setRoomeCode(roomCode);
  };

  const demoStyle = {
    opacity: ".5",
    pointerEvents: "none",
  };

  return (
    <form style={demoStyle} className="lobbyForm">
      <p>Enter Your Name:</p>
      <input
        maxLength={15}
        ref={playerName}
        type="text"
        placeholder="Name"
        required
        className="lobbyJoinInputField"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p>Enter Room Code:</p>
      <input
        ref={roomKey}
        type="text"
        placeholder="code"
        required
        value={roomCode}
        style={roomCode.length <= 20 ? { color: "red" } : null}
        className="lobbyJoinInputField"
        onChange={(e) => displayRoomCode(e.target.value)}
      />

      <button type="submit" className="waitingLobbyButton">
        <span>Join Game</span>
      </button>
    </form>
  );
};

export default JoinGame;
