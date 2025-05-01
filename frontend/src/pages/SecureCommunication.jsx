import React, { useState, useEffect } from "react";
import axios from "axios";
import routes from "../routes";
import ChatBox from "../components/Chat/ChatBox";

const SecureCommunication = ({ shopId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(routes.fetchMessages, { params: { shopId } });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [shopId]);

  const handleSendMessage = async () => {
    try {
      const messageData = {
        sender: 'User', // or 'Owner'
        senderId: userId, // Make sure this is populated correctly
        receiver: 'Owner', // or 'User'
        receiverId: ownerId, // Make sure this is populated correctly
        message: message, // Actual message to send
      };
  
      const response = await axios.post('http://localhost:5000/api/chat/messages', messageData);
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div>
      <ChatBox
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default SecureCommunication;
