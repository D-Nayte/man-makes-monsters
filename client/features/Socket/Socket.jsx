import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:5555");

export default function Socket() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div>
      <h1>Socket.io</h1>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h2>Message</h2>
      <p>{messageReceived}</p>
    </div>
  );
}
