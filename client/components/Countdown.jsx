import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer";
import { CgLogIn } from "react-icons/cg";

function Countdown({
  timer,
  setTimer,
  lobbyId,
  socket,
  isCzar,
  gameStage,
  confirmed,
}) {
  const [updateClients, setUpdateClients] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(null);

  const windowWidth = window && window.innerWidth;

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return;
    } else
      return (
        <div className="timer">
          <div className="value">{remainingTime}</div>
        </div>
      );
  };

  const synchronizeTimer = ({ timer, requestSync }) => {
    //send current timer after request
    if (timer === "sendSync" && isCzar) {
      return socket.emit("sendTimer", {
        timer: currentTimer,
        lobbyId,
      });
    }
    //send actuall timer
    if (isCzar && !requestSync) {
      return socket.emit("sendTimer", { timer, lobbyId });
    }
    //request for a timer
    if (requestSync && !isCzar) {
      socket.emit("sendTimer", { requestSync, lobbyId });
    }
  };

  useEffect(() => {
    //if client reloads, requewst for a sync
    if (updateClients)
      synchronizeTimer({ timer: "sendSync", requestSync: false });

    setUpdateClients(false);
  }, [updateClients]);

  useEffect(() => {
    //setup how timer function response, if a client reloads, czar sends timer to all clients again
    socket.on("getTimer", ({ timer, requestSync }) => {
      if (!isCzar && !requestSync) {
        setTimer(timer);
      }
      //request from a client to get the actuall timer
      if (isCzar && requestSync) {
        setUpdateClients(true);
      }
    });
    //request for timer after initial load
    if (!isCzar && !confirmed) synchronizeTimer({ requestSync: true });
    isCzar && synchronizeTimer({ timer });

    return () => {
      socket.removeListener("getTimer");
    };
  }, [isCzar, gameStage]);

  useEffect(() => {
    if (gameStage === "black" && isCzar) {
      const counter = 145;
      setTimer(counter);
      synchronizeTimer({ timer: counter });
    }

    if (gameStage === "white" && isCzar) {
      const counter = 140;

      setTimer(counter);
      synchronizeTimer({ timer: counter });
    }

    if (gameStage === "deciding" && isCzar) {
      const counter = 150;

      setTimer(counter);
      synchronizeTimer({ timer: counter });
    }

    if (gameStage === "winner" && isCzar) {
      const counter = 120;

      setTimer(counter);
      synchronizeTimer({ timer: counter });
    }
  }, [gameStage, isCzar, timer]);

  if (!timer) return null;

  return (
    <div className="timer-wrapper">
      <div style={windowWidth < 700 ? { display: "none" } : null}>
        <CountdownCircleTimer
          style={{ display: "none" }}
          key={timer}
          isPlaying={timer ? true : false}
          size={100}
          strokeWidth={17}
          strokeLinecap="butt"
          trailStrokeWidth={0}
          onUpdate={(remainingTime) => {
            setCurrentTimer(remainingTime);
          }}
          duration={timer}
          colors={["#fff", "#EB455F", "#EB455F"]}
          colorsTime={[10, 5, 0]}
          onComplete={() => {
            synchronizeTimer({ timer: null });
            setTimer(null);
            return {
              shouldRepeat: false,
              delay: 1,
              newInitialRemainingTime: 0,
            };
          }}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <div
        className="customTimer"
        style={
          windowWidth > 700
            ? { display: "none" }
            : {
                width: `${(currentTimer / timer) * 100}%`,
                backgroundColor: currentTimer < 15 ? "#EB455F" : "white",
                zIndex: "20",
              }
        }
      >
        <div className="remainingTime">{currentTimer}</div>
      </div>
    </div>
  );
}
export default Countdown;
