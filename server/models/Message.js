// File: server/models/Message.js
const mongoose = require('mongoose')
const MessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
    cipher: String,
    encryptedText: String,
    createdAt: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model("Message", MessageSchema);