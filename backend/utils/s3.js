const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to upload a file to S3
const uploadFileToS3 = async (file, folder = "") => {
  const fileContent = fs.readFileSync(file.path);

  // Generate a unique file name
  const encryptedName = crypto.randomBytes(16).toString("hex");
  const fileName = `${folder ? `${folder}/` : ""}${encryptedName}-${file.originalname}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("File upload failed");
  }
};

// Helper function to download a file from S3
const downloadFileFromS3 = async (fileKey, downloadPath) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3.send(command);
    const outputPath = path.resolve(downloadPath, fileKey.split("/").pop());
    const stream = data.Body;

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(outputPath);
      stream.pipe(writeStream);
      writeStream.on("finish", () => resolve(outputPath));
      writeStream.on("error", (err) => reject(err));
    });
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    throw new Error("File download failed");
  }
};

// Helper function to delete a file from S3
const deleteFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("File deletion failed");
  }
};

module.exports = {
  uploadFileToS3,
  downloadFileFromS3,
  deleteFileFromS3,
};
