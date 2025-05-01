const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");  // Import from AWS SDK v3
const multer = require("multer");
const mongoose = require("mongoose");
const UploadedFile = require("../models/UploadedFile"); // The model for storing file info

// Initialize AWS S3 client (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,  // Define the region in your environment variables
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint for uploading files
const uploadFile = async (req, res) => {
  try {
    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const { userId, shopId } = req.body;

    // Ensure userId and shopId are present
    if (!userId || !shopId) {
      return res.status(400).json({ error: "User ID and Shop ID are required." });
    }

    // Generate S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME, // Your S3 bucket name from environment variable
      Key: `${Date.now()}-${req.file.originalname}`, // Use timestamp to make filenames unique
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", // The file will be publicly accessible
    };

    // Use PutObjectCommand from AWS SDK v3
    const command = new PutObjectCommand(params);

    // Upload to S3
    try {
      const data = await s3.send(command); // Send the command using the send method
      // Once uploaded, we get the URL from the response (data.Location)
      const uploadedFile = new UploadedFile({
        userId,           // The ID of the user uploading the file
        shopId,           // The ID of the shop this file belongs to
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`, // S3 URL where the file is stored
        fileName: req.file.originalname, // Original filename
      });

      // Save file information to MongoDB
      await uploadedFile.save();
      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`, // Return the file URL to the client
      });
    } catch (err) {
      console.error("Error uploading file to S3:", err);
      return res.status(500).json({ error: "Failed to upload to S3" });
    }

  } catch (err) {
    console.error("Error in file upload:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadFile, upload };
