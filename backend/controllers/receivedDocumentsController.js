// controllers/receivedDocumentsController.js
const Message = require('../models/Message');
const Owner = require('../models/Owner'); // Assuming the Owner model exists

// Get received documents for the specified owner
exports.getReceivedDocuments = async (req, res) => {
  const { ownerId } = req.params;

  try {
    // Check if the owner exists
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Fetch all documents where the receiver is the owner
    const documents = await Message.find({ receiverId: ownerId })
      .populate('senderId', 'name username') // Populating sender information
      .sort({ timestamp: -1 }); // Sort documents by timestamp (most recent first)

    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents received" });
    }

    // Return the documents to the frontend
    res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching received documents:", error);
    res.status(500).json({ error: "Server error" });
  }
};
