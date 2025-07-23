// SignupForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      toast.success(res.data.message || 'Signup successful!');
      setFormData({ email: '', password: '' });
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password (alphanumeric, min 6 chars)</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SignupForm;
