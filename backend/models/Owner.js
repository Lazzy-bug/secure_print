const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
