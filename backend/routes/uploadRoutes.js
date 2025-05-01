const express = require('express');
const multer = require('multer');
const s3 = require('../config/s3Config'); // Import the configured S3 instance
const Message = require('../models/Message'); // Assuming Message schema is used
const router = express.Router();

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  const { userId, shopId, ownerId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  if (!userId || !shopId || !ownerId) {
    return res.status(400).json({ message: 'User ID, Shop ID, and Owner ID are required.' });
  }

  try {
    // Generate a unique filename
    const fileName = Date.now() + '-' + req.file.originalname;

    // Create S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName, // Unique key for the file
      Body: req.file.buffer, // File data from the request
      ACL: 'public-read', // Set the file to be publicly accessible
      ContentType: req.file.mimetype, // File type
    };

    // Upload the file to S3 using the AWS SDK
    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.error('Error uploading file to S3:', err);
        return res.status(500).json({ message: 'Failed to upload file. Please try again.' });
      }

      const fileUrl = data.Location; // The URL of the uploaded file

      // Save the file URL, userId, and ownerId in MongoDB (Message model)
      const newMessage = new Message({
        sender: 'User',
        senderId: userId,
        receiver: 'Owner',
        receiverId: ownerId,
        message: `File uploaded: ${fileUrl}`,
        fileUrl: fileUrl,
        timestamp: new Date(),
      });

      await newMessage.save();

      res.status(200).json({
        message: 'File uploaded successfully.',
        fileUrl: fileUrl,
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to upload file. Please try again.' });
  }
});

module.exports = router;
