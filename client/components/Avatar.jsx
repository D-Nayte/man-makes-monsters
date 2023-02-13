import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import React, { useEffect, useState } from "react";
import AvatarCustomizer from "./AvatarCustomizer";
import { parseCookies } from "nookies";
import { useAppContext } from "../context";
import { useRouter } from "next/router";
import emotions from "../utils/avatarEmotions.js";
import { GoSettings } from "react-icons/go";
import { motion as m } from "framer-motion";
import { patchUserProfile } from "../utils/patchProfile";
import { useSession } from "next-auth/react";

const Avatar = ({ userName, playerId, playerAvatar, isPopup, socket }) => {
  const cookies = parseCookies();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [currGameId, setCurrGameId] = useState(false);
  const { storeData, setStoreData } = useAppContext();
  const [showAvatar, setShowAvatar] = useState(false);
  const { data: session } = useSession();
  const [avatarOptions, setAvatarOptions] = useState({
    seed: userName,
    ...playerAvatar,
  });

  const addAccessories = ({ key, value, newOptions }) => {
    // active accessories/beard/... probability if one of those is selected
    if (key === "accessories" || key === "facialHair")
      return value === "none"
        ? (newOptions[`${key}Probability`] = 0)
        : (newOptions[`${key}Probability`] = 100);
  };

  const handleSetAvatarOptions = (value, key) => {
    const newOptions = { ...avatarOptions };
    addAccessories({ key, value, newOptions });

    newOptions[key] = [value];
    storeAvatarSettings(newOptions);
  };

  const handlEemotions = (emotions) => {
    const newOptions = { ...avatarOptions, ...emotions };
    storeAvatarSettings(newOptions);
  };

  const storeAvatarSettings = async (options) => {
    if (playerId === cookies.socketId) {
      // if in runnning game, also update Game object
      if (currGameId) {
        socket.emit("changeGame", {
          lobbyId: storeData.lobbyId,
          gameId: storeData.lobbyId,
          playerId: playerId,
          avatar: options,
          changeAvatar: true,
        });
      }
      socket.emit("updateLobby", {
        lobbyId: storeData.lobbyId,
        id: playerId,
        avatar: options,
      });
      if (session) {
        const profile = await patchUserProfile({
          key: "avatar",
          value: options,
        });
        setStoreData((prev) => ({ ...prev, profile }));
      }
    }
  };

  //create avatar based on options
  const AvatarSVG = ({ avatarOptions }) => {
    const avatar = createAvatar(avataaars, { ...avatarOptions });
    const svg = avatar.toString();

    return (
      <div
        onClick={() => playerId === cookies.socketId && setShowSettings(true)}
        className={"avatar-image"}
        style={playerId === cookies.socketId ? { cursor: "pointer" } : null}
        dangerouslySetInnerHTML={{ __html: svg }}></div>
    );
  };

  useEffect(() => {
    if (playerId === cookies.socketId && !isPopup && !session) {
      storeAvatarSettings(avatarOptions);
    }
  }, []);

  useEffect(() => {
    if (session && storeData?.profile?.avatar && playerId === cookies.socketId)
      return setAvatarOptions({
        ...storeData.profile.avatar,
        seed: storeData.profile.name,
      });
    if (!session || playerId !== cookies.socketId) {
      setAvatarOptions({
        seed: userName,
        ...playerAvatar,
      });
    }
  }, [storeData, storeData.profile, playerAvatar]);

  useEffect(() => {
    if (router.query.gameId) return setCurrGameId(router.query.gameId);
    setCurrGameId(false);
  }, [router.isReady]);

  useEffect(() => {
    if (
      storeData.changeAvatar &&
      isPopup &&
      storeData.changeAvatar === playerId
    ) {
      setShowAvatar(true);
      setTimeout(() => {
        setShowAvatar(false);
        setStoreData((prev) => ({ ...prev, changeAvatar: null }));
      }, 5000);
    }
  }, [storeData.changeAvatar]);

  if (isPopup && showAvatar)
    return (
      <m.div
        className="motionAvatarContainer"
        initial={{ y: 150 }}
        animate={{
          y: -30,
          transition: { duration: 0.5, ease: "linear" },
        }}>
        <p>{userName}</p>
        <AvatarSVG avatarOptions={avatarOptions} />
      </m.div>
    );

  if (!isPopup)
    return (
      <div className="scoreBoardAvatars">
        {playerId === cookies.socketId && (
          <GoSettings className="customiseIcon" />
        )}
        <AvatarSVG avatarOptions={avatarOptions} />
        {showSettings && (
          <>
            <AvatarCustomizer
              handleSetAvatarOptions={handleSetAvatarOptions}
              setShowSettings={setShowSettings}
              currGameId={currGameId}>
              <div className="avatar-preview">
                <AvatarSVG avatarOptions={avatarOptions} />
                <div>
                  <h3>EMOTIONS</h3>
                  <ul>
                    {emotions &&
                      emotions.map((emotion) => (
                        <li key={emotion.label}>
                          <button
                            style={{ textTransform: "uppercase" }}
                            onClick={() => handlEemotions(emotion.settings)}>
                            {emotion.label}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </AvatarCustomizer>
          </>
        )}
      </div>
    );
};
export default Avatar;
