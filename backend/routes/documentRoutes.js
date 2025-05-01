const express = require('express');
const multer = require('multer');
const s3 = require('../config/s3Config');
const Message = require('../models/Message');
const verifyToken = require("../middlewares/verifyToken");
const { encrypt, decrypt } = require('../utils/encryption');
const sanitizeFilename = require('sanitize-filename');
const User = require('../models/User');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to sanitize filename
const createSafeFileName = (originalName) => {
  // Remove spaces and special characters, replace with underscores
  const sanitized = sanitizeFilename(originalName).replace(/\s+/g, '_');
  return `${Date.now()}-${sanitized}`;
};

// Get received documents
router.get('/received-documents/:ownerId', verifyToken, async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log(`Fetching documents for ownerId: ${ownerId}`);

    // Fetch messages for the owner
    const messages = await Message.find({ 
      receiverId: ownerId, 
      receiver: 'Owner' 
    }).sort({ timestamp: -1 });

    // Fetch sender details manually and add to each message
    const documentsWithSenderDetails = await Promise.all(messages.map(async (msg) => {
      // Try to find the sender by senderId
      let sender = await User.findById(msg.senderId).select('name username');
      
      // If sender not found, set as "Unknown"
      if (!sender) {
        sender = { name: "Unknown", username: "Unknown" };
      }
      
      return {
        ...msg.toObject(),
        senderName: sender.name,
        senderUsername: sender.username
      };
    }));

    res.status(200).json({
      message: 'Documents fetched successfully.',
      documents: documentsWithSenderDetails,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Decrypt and serve file
router.get('/decrypt-file/:documentId', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    console.log('Attempting to decrypt document:', documentId);

    const document = await Message.findOne({
      _id: documentId,
      receiverId: req.user.id
    });

    if (!document) {
      console.log('Document not found or unauthorized access');
      return res.status(404).json({ message: 'Document not found or unauthorized' });
    }

    const fileKey = decodeURIComponent(document.fileUrl.split('/').slice(-1)[0]);
    console.log('S3 File Key:', fileKey);
    
    try {
      const s3File = await s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
      }).promise();

      console.log('Successfully retrieved file from S3');

      const decryptedData = decrypt(
        s3File.Body,
        document.iv,
        Buffer.from(document.encryptedKey, 'hex')
      );

      // Set appropriate content type based on file extension
      const fileExtension = fileKey.split('.').pop().toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (fileExtension === 'pdf') {
        contentType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExtension)) {
        contentType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        contentType = 'image/png';
      } else if (fileExtension === 'gif') {
        contentType = 'image/gif';
      }

      res.set({
        'Content-Type': contentType,
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;",
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      });
      
      res.send(decryptedData);
    } catch (s3Error) {
      console.error('Error fetching from S3:', s3Error);
      if (s3Error.code === 'NoSuchKey') {
        await Message.findByIdAndDelete(documentId);
        return res.status(404).json({ 
          message: 'File not found in storage',
          error: 'The file has been deleted or moved'
        });
      }
      res.status(500).json({ 
        message: 'Failed to retrieve file from storage',
        error: s3Error.message
      });
    }
  } catch (error) {
    console.error('Error decrypting file:', error);
    res.status(500).json({ 
      message: 'Failed to decrypt file',
      error: error.message 
    });
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  
  const { userId, shopId, ownerId } = req.body;
  if (!userId || !shopId || !ownerId) {
    return res.status(400).json({ message: 'User ID, Shop ID, and Owner ID are required.' });
  }

  try {
    console.log('Processing file upload...');
    
    // Create safe filename without spaces
    const safeFileName = createSafeFileName(req.file.originalname);
    console.log('Original filename:', req.file.originalname);
    console.log('Safe filename:', safeFileName);
    
    // Encrypt the file
    const { iv, encryptedData, authTag } = encrypt(req.file.buffer);
    
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: safeFileName,
      Body: encryptedData,
      ContentType: req.file.mimetype,
      Metadata: {
        'iv': iv,
        'auth-tag': authTag.toString('hex')
      }
    };

    console.log('Uploading file to S3:', safeFileName);

    const uploadResult = await s3.upload(uploadParams).promise();
    console.log('File uploaded successfully to S3:', uploadResult.Location);

    const newMessage = new Message({
      sender: 'User',
      senderId: userId,
      receiver: 'Owner',
      receiverId: ownerId,
      message: `File uploaded: ${req.file.originalname}`,
      fileUrl: uploadResult.Location,
      iv: iv,
      encryptedKey: authTag.toString('hex'),
      timestamp: new Date(),
    });

    await newMessage.save();
    console.log('Message saved to database with ID:', newMessage._id);

    res.status(200).json({
      message: 'File uploaded successfully.',
      fileUrl: uploadResult.Location,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload file.' });
  }
});

// Delete document
router.delete("/delete-document/:documentId", async (req, res) => {
  const { documentId } = req.params;

  try {
    const document = await Message.findById(documentId); // Fetch document by ID without checking receiverId

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const fileUrl = document.fileUrl;
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL not found in the document" });
    }

    const s3Key = decodeURIComponent(new URL(fileUrl).pathname.substring(1));

    try {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
      }).promise();
      console.log("File deleted from S3:", s3Key);
    } catch (s3Error) {
      console.error("Error deleting from S3:", s3Error);
    }

    await Message.findByIdAndDelete(documentId);
    console.log("Document deleted from database:", documentId);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document", error: error.message });
  }
});


module.exports = router;
