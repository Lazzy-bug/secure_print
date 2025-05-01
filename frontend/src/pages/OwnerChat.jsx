import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const OwnerChat = ({ ownerId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("ownerJoin", { ownerId });

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.close();
  }, [ownerId]);

  return (
    <div>
      <h1>Owner Chat</h1>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerChat;
