import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      alert(res.data.message);

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Set userData to show it on the screen
      setUserData(res.data.user);

      console.log('Logged in user:', res.data.user);
      navigate('/landing');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
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

      {userData && (
        <div style={{ marginTop: '20px' }}>
          <h3>User Info</h3>
          <p><strong>Full Name:</strong> {userData.fullName}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Password:</strong> {userData.password}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
