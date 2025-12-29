// frontend/src/components/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import css from '../css/login.module.css';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Use context login function
      login(data.token, data.admin);

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      // Handle network errors and other errors
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.loginContainer}>
      <div className={css.loginBox}>
        <h2>Admin Login</h2>
        {error && <div className={css.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>
          <div className={css.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}