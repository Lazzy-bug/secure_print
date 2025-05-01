const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
