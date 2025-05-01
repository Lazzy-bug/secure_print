import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams

const ChatRoom = ({ userId }) => {
  const { roomId } = useParams(); // Get the roomId from the URL
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!roomId) {
      console.error("Room ID is missing!");
      return;
    }

    // Establish a socket connection when the component mounts
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Emit an event to join the specific chat room
    newSocket.emit("joinRoom", { roomId });

    // Listen for incoming messages
    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      // Clean up when the component unmounts by closing the socket connection
      newSocket.close();
    };
  }, [roomId]); // Make sure to re-run effect when roomId changes

  const sendMessage = () => {
    if (message.trim() && socket) {
      const sender = userId;

      console.log("Sending message:", { roomId, message, sender }); // Log the data before sending

      // Emit the message to the backend via socket
      socket.emit("sendMessage", { roomId, message, sender });
      setMessages((prev) => [...prev, { sender: "You", message }]);
      setMessage(""); // Clear input after sending

      // Now, send the message to the backend via Axios
      axios
        .post("http://localhost:5000/api/chat/messages", { roomId, message, sender }, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          console.log("Message saved successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          if (error.response) {
            console.error("Error response from backend:", error.response.data);
          }
        });
    } else {
      console.error("Message is empty or socket not initialized");
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Send file to backend
        const response = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const fileUrl = response.data.fileUrl;

        // Emit the file URL to the backend to notify other users
        socket.emit("sendMessage", { roomId, message: fileUrl, sender: userId });

        // Add the file link to the chat
        setMessages((prev) => [
          ...prev,
          { sender: "You", message: <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a> },
        ]);

        // Reset the file state after uploading
        setFile(null);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      {/* Display messages */}
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {/* Display messages, including file links */}
            {typeof msg.message === "string" && !msg.message.startsWith("http") ? (
              <p>
                <strong>{msg.sender}:</strong> {msg.message}
              </p>
            ) : (
              <p>
                <strong>{msg.sender}:</strong>{" "}
                <a href={msg.message} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Input for text messages */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>

      {/* Input for file uploads */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default ChatRoom;
