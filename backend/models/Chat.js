const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Chat', chatSchema);
