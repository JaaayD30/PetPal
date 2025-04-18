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
  
      // ✅ Save user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
  
      console.log('Logged in user:', res.data.user);
      navigate('/landing'); // route to LandingPage after login
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  

  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential;
  
    try {
      const res = await axios.post('http://localhost:5000/api/google-login', { token });
      alert(res.data.message);
  
      // ✅ Save Google user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
  
      navigate('/user-details'); // Or /profile, depending on your route
    } catch (err) {
      alert('Google login failed');
    }
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
