// File: src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { encryptText, decryptText } from '../api';
import './Form.css';

const Dashboard = () => {
  const [text, setText] = useState('');
  const [cipher, setCipher] = useState('caesar');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const token = localStorage.getItem('token');

  const handleEncrypt = async () => {
    const res = await encryptText({ text, cipher }, token);
    setEncrypted(res.data.encryptedText);
    console.log('enc', res.data.encryptedText)
    setDecrypted('');
  };

  const handleDecrypt = async () => {
    try {
      const res = await decryptText({ encryptedText: encrypted, cipher }, token);
      setDecrypted(res.data.decrypted);
    } catch (err) {
      setDecrypted('Not decryptable');
    }
  };

  return (
    <div className="form-container">
      <h2>Encryption Dashboard</h2>
      <input placeholder="Enter text" value={text} onChange={e => setText(e.target.value)} />
      <select value={cipher} onChange={e => setCipher(e.target.value)}>
        <option value="caesar">Caesar Cipher</option>
        <option value="base64">Base64</option>
        <option value="aes">AES</option>
        <option value="sha256">SHA256 (one-way)</option>
      </select>
      <button onClick={handleEncrypt}>Encrypt</button>
      {encrypted && <p><strong>Encrypted:</strong> {encrypted}</p>}
      {cipher !== 'sha256' && encrypted && <button onClick={handleDecrypt}>Decrypt</button>}
      {decrypted && <p><strong>Decrypted:</strong> {decrypted}</p>}
    </div>
  );
};

export default Dashboard;

