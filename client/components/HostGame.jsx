import { parseCookies } from "nookies";
import useLocalStorage from "./useLocalStorage";

//Hosting a new game
const HostGame = ({ playerName, socket }) => {
  let [value, setValue] = useLocalStorage("name", "");
  const cookies = parseCookies();

  const handleSubmit = (e) => {
    e.preventDefault();
    const hostName = playerName.current.value;
    const id = cookies.socketId;

    socket.emit("createNewLobby", { hostName, id });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="lobbyForm">
      <input
        maxLength={15}
        ref={playerName}
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
