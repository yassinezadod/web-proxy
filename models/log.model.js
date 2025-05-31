// models/log.model.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  url: String,
  ip: String,
  timestamp: { type: Date, default: Date.now },
  bandwidthUsed: Number, // octets
  userAgent: String,
  statusCode: Number,
  settingsUsed: {
    disableJS: Boolean,
    blockAds: Boolean
  }
});

module.exports = mongoose.model('Log', logSchema);
