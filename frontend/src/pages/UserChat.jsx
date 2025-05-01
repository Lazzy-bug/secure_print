import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const UserChat = ({ userId }) => {
  const { shopId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [error, setError] = useState("");

  // Establish socket connection and handle new messages
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("joinChat", { userId, shopId });

    // Handle incoming messages
    newSocket.on("receiveMessage", (msg) => {
      handleMessages(msg);
    });

    return () => {
      newSocket.close();
    };
  }, [shopId, userId]);

  // Fetch the owner's ID for the current shop
  useEffect(() => {
    const fetchOwnerId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shops/${shopId}`);
        const shop = response.data.shop;
        if (shop && shop.owner) {
          const ownerId = shop.owner._id; // Access the populated owner details
          setOwnerId(ownerId);
        } else {
          console.error("Owner data is missing in the response.");
        }
      } catch (error) {
        console.error("Error fetching owner ID:", error);
        setError("Failed to fetch owner information.");
      }
    };

    fetchOwnerId();
  }, [shopId]);

  // Function to handle incoming messages and update state
  const handleMessages = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Function to send a message
  const sendMessage = async () => {
    if (!message.trim() || !ownerId) {
      setError("Please provide a message and ensure the owner is available.");
      return; // Ensure ownerId and message are not empty
    }

    const payload = {
      sender: "User",
      senderId: userId,
      receiver: "Owner",
      receiverId: ownerId,
      message,
    };

    try {
      setMessages((prev) => [...prev, { sender: "You", text: message }]);
      setMessage(""); // Reset message input

      const response = await axios.post("http://localhost:5000/api/chat/messages", payload);

      if (response.status === 201) {
        socket.emit("sendMessage", payload); // Emit the message via socket if successful
      } else {
        setError(response.data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message.");
    }
  };

  // Function to upload a file
  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return; // Ensure a file is selected
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("shopId", shopId);
    formData.append("ownerId", ownerId);

    try {
      const response = await axios.post("http://localhost:5000/api/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = response.data.fileUrl;
      setMessages((prev) => [
        ...prev,
        { sender: "You", text: <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a> },
      ]);
      setFile(null); // Reset file input
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file.");
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="file-upload">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
};

export default UserChat;
