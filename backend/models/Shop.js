const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
});

module.exports = mongoose.model('Shop', shopSchema);
