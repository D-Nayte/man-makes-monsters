import { useSession } from "next-auth/react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { patchUserProfile } from "../utils/patchProfile";
import useLocalStorage from "./useLocalStorage";

//Hosting a new game
const HostGame = ({ socket, value, setValue }) => {
  const cookies = parseCookies();
  const { data: session } = useSession();
  const { storeData, setStoreData } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hostName = value;
    const id = cookies.socketId;

    socket.emit("createNewLobby", { hostName, id });

    if (session) {
      const profile = await patchUserProfile({
        key: "name",
        value,
      });
      setStoreData((prev) => ({ ...prev, profile }));
    }
  };

  useEffect(() => {
    if (session && storeData?.profile?.name) setValue(storeData.profile.name);
  }, [session, storeData.profile]);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="lobbyForm">
      <input
        maxLength={15}
        type="text"
        placeholder="Enter Name"
        required
        className="lobbyInputField"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <button type="submit" className="waitingLobbyButton">
        Host Game
      </button>
    </form>
  );
};

export default HostGame;
