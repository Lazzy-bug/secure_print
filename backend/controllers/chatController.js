const Chat = require('../models/Chat');

exports.getChatRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chat = await Chat.findOne({ roomId }).populate('messages.senderId', 'name');
    if (!chat) return res.status(404).json({ message: 'Chat room not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMessage = async (req, res) => {
  const { roomId, senderId, message } = req.body;

  try {
    let chat = await Chat.findOne({ roomId });
    if (!chat) {
      chat = new Chat({ roomId, messages: [] });
    }
    chat.messages.push({ senderId, message });
    await chat.save();
    res.status(200).json({ message: 'Message added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
