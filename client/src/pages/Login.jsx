// File: src/pages/Login.jsx
import React, { useState } from 'react';
import { login } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import './Form.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <input type='email' placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type='submit'>Login</button>
      <Link to={'/register'}>Go to SignUp</Link>
      <p>{message}</p>
      </form>
    </div>
  );
};

export default Login;