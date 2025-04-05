// File: src/pages/Register.jsx
import React, { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ email, password });
      setMessage(res.data.message);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
      <input placeholder="Email" type='email' value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type='submit'>Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;