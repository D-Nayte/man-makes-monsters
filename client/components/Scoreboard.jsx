import React, { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { VscDebugDisconnect } from "react-icons/vsc";
import { RiVipCrown2Fill } from "react-icons/ri";
import { CgCloseO } from "react-icons/cg";
import { useAppContext } from "../context";
import KickButton from "./KickButton";
import { parseCookies } from "nookies";
import Avatar from "./Avatar.jsx";

const Scoreboard = ({ currentLobby, socket, isOpen, setIsOpen }) => {
  const [showKick, setShowKick] = useState(false);
  const cookies = parseCookies();
  const { turns } = currentLobby;
  let players = currentLobby.waiting
    ? currentLobby.waiting
    : currentLobby.players;

  const currentTurn = turns && turns[turns.length - 1];
  const { stage, white_cards, czar } = currentTurn
    ? currentTurn
    : { stage: null, white_cards: null };
  const { storeData, setStoreData } = useAppContext();
  const submittedWhiteCards = (playerId) => {
    if (white_cards && currentLobby) {
      const player = white_cards.find((player) => player.player === playerId);

      //display checkmark after submittetd white cards during "white" gamestage
      if (
        stage[stage.length - 1] === "white" ||
        stage[stage.length - 1] === "deciding"
      ) {
        if (player && player.played_card && player.played_card.length > 0)
          return true;
      }
      if (stage[stage.length - 1] === "winner") {
        const readyPlayer = currentTurn.completed.find(
          (player) => player.player_id === playerId
        );
        if (readyPlayer) return true;
      }
    }
    return false;
  };

  const sortPlayers = (players) => {
    const allPlayers = [...players];
    const currentPlayer = players.find(
      (player) => player.id === cookies.socketId
    );
    const currentPlayerIndex = players.indexOf(currentPlayer);
    return [...allPlayers.splice(currentPlayerIndex, 1), ...allPlayers];
  };

  const openMenu = () => {
    setIsOpen(!isOpen);
  };

  function calculateFontSize(name) {
    return 26 - (name.length + 1) + "px";
  }

  return (
    <>
      <div
        className={!isOpen ? "sideMenu" : "sideMenu active"}
        style={{
          boxShadow: isOpen ? "20px 2px 31px 4px #8781813e" : "none",
        }}>
        <div
          className="scoreButton"
          onClick={openMenu}
          style={{
            opacity: isOpen ? "0" : "1",
            cursor: isOpen ? "default" : "pointer",
          }}>
          <p>SCORES</p>
        </div>
        <button className="closeScorebutton" onClick={openMenu}>
          <CgCloseO className="closeMenuButton " />
        </button>
        <ul className="scoreboardList">
          <h1>SCOREBOARD</h1>

          <li className="scoreboardTitles">
            <div className="lastStep">Status</div>
            <div>Name</div>
            <div>Score</div>
          </li>
          {players &&
            sortPlayers(players).map((player, index) => (
              <li
                key={player.id + index}
                className={player.inactive ? "inactive-player" : null}
                onMouseEnter={(e) => setShowKick(e.target.dataset.id)}
                onMouseLeave={showKick ? () => setShowKick(false) : null}
                data-id={player.id}
                style={
                  players && players.length > 7 ? { height: "60px" } : null
                }>
                <div>
                  {storeData.isHost && player.id !== cookies.socketId && (
                    <KickButton
                      showKick={showKick}
                      playerId={player.id}
                      socket={socket}
                      playerName={player.name}
                    />
                  )}

                  {!player.inactive ? (
                    <AiOutlineCheckCircle
                      className={
                        !submittedWhiteCards(player.id)
                          ? "checkmark"
                          : "checkmark active"
                      }
                    />
                  ) : (
                    <VscDebugDisconnect className="disconnect-icon" />
                  )}
                </div>
                <div className="profileContainer">
                  {czar && czar.id === player.id && (
                    <div className={"crown-background"}>
                      <RiVipCrown2Fill className="crown" />
                    </div>
                  )}
                  <Avatar
                    userName={player.name}
                    playerId={player.id}
                    playerAvatar={player.avatar}
                    socket={socket}
                  />

                  <span
                    className="player-name"
                    style={{ fontSize: `${calculateFontSize(player.name)}` }}>
                    {player.name}
                  </span>
                </div>
                <div>
                  <span className="player-points">{player.points}</span>
                </div>
              </li>
            ))}
        </ul>

        <div className="avatar-popup-container">
          {players.map((player, index) => {
            return (
              <Avatar
                key={player.name + index}
                userName={player.name}
                playerId={player.id}
                playerAvatar={player.avatar}
                isPopup={true}
                socket={socket}
              />
            );
          })}
        </div>

        {turns?.length > 0 && (
          <div className="scoreStats">
            <div className="fuckingClass">
              <h4>
                turn: {turns.length}/{currentLobby.setRounds}
              </h4>
            </div>
            <div>
              <h4>Players: {players.length}</h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Scoreboard;
