import React from "react";

const ChatBox = ({ messages, newMessage, setNewMessage, onSendMessage }) => {
  return (
    <div className="p-4 border rounded">
      <div className="h-64 overflow-y-scroll mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.isOwner ? "text-right" : "text-left"}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button className="bg-green-500 text-white p-2 mt-2 w-full" onClick={onSendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
