// File: server/routes/encryptionRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Message = require("../models/Message");
const router = express.Router();

function caesarEncrypt(text, shift = 3) {
  return text.replace(/[a-z]/gi, c => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
  });
}

function caesarDecrypt(text, shift = 3) {
  return caesarEncrypt(text, 26 - shift);
}

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

router.post("/encrypt", verifyToken, async (req, res) => {
  const { text, cipher } = req.body;
  let encryptedText = "";

  try {
    if (cipher === "caesar") encryptedText = caesarEncrypt(text);
    else if (cipher === "base64") encryptedText = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    else if (cipher === "aes") encryptedText = CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
    else if (cipher === "sha256") encryptedText = CryptoJS.SHA256(text).toString();
    else return res.status(400).json({ message: "Unsupported cipher" });

    const message = new Message({ userId: req.userId, text, cipher, encryptedText });
    await message.save();

    res.json({ encryptedText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/decrypt", verifyToken, (req, res) => {
  const { encryptedText, cipher } = req.body;
  try {
    let decrypted = "";
    if (cipher === "caesar") decrypted = caesarDecrypt(encryptedText);
    else if (cipher === "base64") decrypted = CryptoJS.enc.Base64.parse(encryptedText).toString(CryptoJS.enc.Utf8);
    else if (cipher === "aes") {
      const bytes = CryptoJS.AES.decrypt(encryptedText, process.env.SECRET_KEY);
      decrypted = bytes.toString(CryptoJS.enc.Utf8);
    } else return res.status(400).json({ message: "Unsupported or irreversible cipher" });

    res.json({ decrypted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;