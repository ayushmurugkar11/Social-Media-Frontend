// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
        
         localStorage.setItem('authToken', res.data.token)

      toast.success('Login successful! 🎉');
        console.log('Token:', res.data.token);
        navigate('/home')
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Something went wrong during login';
      toast.error(msg);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h1 className="text-center mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
          </form>
          
          <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
