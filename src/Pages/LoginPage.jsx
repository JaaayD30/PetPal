import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import navigation hook
import { GoogleLogin } from '@react-oauth/google'; // Use this import instead

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate(); // initialize router navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      alert(res.data.message);
      console.log('Logged in user:', res.data.user);
      navigate('/landing'); // route to LandingPage after login
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // Google login success handler
  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential; // Adjusted to match the @react-oauth/google API

    try {
      const res = await axios.post('http://localhost:5000/api/google-login', { token });
      alert(res.data.message);
      navigate('/user-details'); // Redirect to UserDetailsPage
    } catch (err) {
      alert('Google login failed');
    }
  };

  // Google login error handler
  const handleGoogleLoginFailure = (error) => {
    alert('Google login failed. Please try again.');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button type="submit">Log In</button>
      </form>

    </div>
  );
};

export default LoginPage;
