const mongoose = require("mongoose");

const uploadedFileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ID uploading the file
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true }, // Shop ID the file belongs to
    fileUrl: { type: String, required: true }, // URL of the file stored in S3
    fileName: { type: String, required: true }, // Name of the file
    uploadedAt: { type: Date, default: Date.now }, // Timestamp for when the file was uploaded
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const UploadedFile = mongoose.model("UploadedFile", uploadedFileSchema);
module.exports = UploadedFile;
