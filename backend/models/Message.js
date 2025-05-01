const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  message: { type: String, required: true },
  fileUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  iv: { type: String, required: true }, // Initialization vector for encryption
  encryptedKey: { type: String, required: true }, // Encrypted file key
});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;