import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { motion as m } from "framer-motion";
import JoinGame from "../components/JoinLobby.jsx";
import HostGame from "../components/HostGame.jsx";
import Error from "../components/Error.jsx";
import Loading from "../components/Loading.jsx";

const Home = ({ socket }) => {
  if (!socket)
    return (
      <main>
        <Loading />
      </main>
    );
  const playerName = useRef("");
  const roomKey = useRef("");
  const [hostOrJoin, setHostOrJoin] = useState(null);
  const router = useRouter();
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [isHostActive, setIsHostActive] = useState(false);
  const [isJoinActive, setIsJoinActive] = useState(false);
  const handleHostClick = (event) => {
    setIsHostActive(true);
    if (setIsJoinActive) setTimeout(() => setIsJoinActive(false), 150);
  };
  const handleJoinClick = (event) => {
    setIsJoinActive(true);
    if (setIsHostActive) setTimeout(() => setIsHostActive(false), 150);
  };

  useEffect(() => {
    //If new lobby was createt, redirect to Lobby with room data
    socket.on("LobbyCreated", ({ lobbyId }) => {
      router.push({
        pathname: `/lobby/${lobbyId}`,
      });
    });

    //redirecting to lobby with data after server found the game in DB
    socket.on("foundRoom", (data) => {
      try {
        const { noRoom, lobbyId, playerName, err } = data;
        if (noRoom) {
          setShowErrMessage(err);
          return;
        }
        if (!lobbyId || !playerName) {
          throw new Error("Invalid lobbyId or playerName");
        }
        router.push({
          pathname: `/lobby/${lobbyId}`,
        });
      } catch (error) {
        console.error(error);
        alert("An error occurred while trying to navigate to the lobby");
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <>
      <main className="lobbyCardsContainer">
        <m.div
          className="hostMotion"
          initial={{ y: -500, rotate: 30 }}
          animate={{ y: 0, rotate: 0 }}
          exit={{
            x: -1300,
            rotate: -120,
            transition: { duration: 0.75 },
          }}>
          <div
            className={
              isHostActive
                ? "lobbyContainer lobbyContainer-active"
                : " lobbyContainer "
            }>
            <div
              id={isJoinActive ? "lobbyHidden" : "lobbyVisible"}
              className={
                isHostActive ? "lobbyCard lobbyCardRotate" : "lobbyCard"
              }
              onClick={() => {
                setHostOrJoin("host");
                handleHostClick();
              }}>
              <div className="lobbyFront">
                <h2>Host a New Game.</h2>
              </div>
              <div className="lobbyBack">
                <h2>I'm the Host but my Homies calls me</h2>
                {hostOrJoin === "host" ? (
                  <HostGame playerName={playerName} socket={socket} />
                ) : null}
              </div>
            </div>
          </div>
        </m.div>
        <m.div
          className="joinMotion"
          initial={{ y: 500, rotate: -30 }}
          animate={{ y: 0, rotate: 0 }}
          exit={{
            y: 1000,
            rotate: 120,
            transition: { duration: 0.75 },
          }}>
          <div
            className={
              isJoinActive
                ? "lobbyContainer  lobbyContainer-active "
                : " lobbyContainer"
            }>
            <div
              id={isHostActive ? "lobbyHostHidden" : "lobbyHostVisible"}
              className={
                isJoinActive ? "lobbyCard lobbyJoinCardRotate" : "lobbyCard"
              }
              onClick={(e) => {
                setHostOrJoin("join");
                handleJoinClick();
              }}>
              <div
                className={
                  isHostActive ? "lobbyFront lobbyjoinhidden" : "lobbyFront"
                }>
                <h2>Join a Game.</h2>
              </div>

              <div className="lobbyBack">
                <h2>Join a Game.</h2>
                {hostOrJoin === "join" ? (
                  <JoinGame
                    setShowErrMessage={setShowErrMessage}
                    roomKey={roomKey}
                    playerName={playerName}
                    socket={socket}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </m.div>
      </main>

      {showErrMessage && (
        <Error
          showErrMessage={showErrMessage}
          setShowErrMessage={setShowErrMessage}
        />
      )}
    </>
  );
};

export default Home;
