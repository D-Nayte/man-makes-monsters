import { useSession } from "next-auth/react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { patchUserProfile } from "../utils/patchProfile";
import useLocalStorage from "./useLocalStorage";

//Hosting a new game
const HostGame = ({ socket }) => {
  let [value, setValue] = useLocalStorage("name", "");
  const cookies = parseCookies();
  const { data: session } = useSession();
  const { storeData, setStoreData } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const hostName = value;
    const id = cookies.socketId;

    socket.emit("createNewLobby", { hostName, id });

    if (session) {
      const profile = patchUserProfile({
        key: "name",
        value,
      });
      setStoreData((prev) => ({ ...prev, profile }));
    }
  };

  useEffect(() => {
    if (session && storeData.profile) setValue(storeData.profile.name);
  }, [session, storeData.profile]);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="lobbyForm">
      {console.log("value", value)}
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
