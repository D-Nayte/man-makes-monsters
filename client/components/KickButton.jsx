import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { useAppContext } from "../context";
import { socket } from "../pages/_app";

const KickButton = ({ playerId, playerName, showKick }) => {
  const { storeData } = useAppContext();
  const [showButton, setShowButton] = useState(false);
  const windowWidth = window && window.innerWidth;
  const handleKick = () => {
    const playerData = {
      playerId,
      lobbyId: storeData.lobbyId,
      kickPlayer: true,
      gameId: storeData.lobbyId,
    };
    socket.emit("changeGame", playerData);
  };

  return (
    <>
      {windowWidth < 700 && (
        <button
          className="mobileKickButton"
          onClick={() => {
            setShowButton(true);
            setTimeout(() => {
              setShowButton(false);
            }, 3000);
          }}
        >
          <CgCloseO />
        </button>
      )}
      {showKick === playerId && (
        <div
          className="kick-container kick-hover"
          onClick={() => setShowButton(true)}
        >
          <img
            className="kick-icon"
            src="/combat-kick.png"
            alt="shoe kicking air"
          />
        </div>
      )}
      {showButton && (
        <div className="kickButtonBackground">
          <button
            onClick={handleKick}
            className="kickButton"
            onMouseLeave={() => setShowButton(false)}
          >
            <p>Kick {playerName}? </p>
          </button>
        </div>
      )}
    </>
  );
};

export default KickButton;
