import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


const HomePage = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Handle Login form change
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle Login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', loginData);
      alert(res.data.message);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUserData(res.data.user);
      console.log('Logged in user:', res.data.user);
      navigate('/landing');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // Handle Google signup success (store email only)
  const handleGoogleLoginSuccess = (response) => {
    try {
      const decoded = jwtDecode(response.credential); // ✅ correct // decode JWT to get user info
      const googleEmail = decoded.email;

      // Save email as placeholder to localStorage
      localStorage.setItem('googleEmail', googleEmail);

      // Redirect to user details page
      navigate('/user-details');
    } catch (err) {
      console.error('JWT Decode Error:', err);
      alert('Google login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleLoginChange}
          value={loginData.username}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleLoginChange}
          value={loginData.password}
          required
        />
        <button type="submit">Log In</button>
      </form>

      <br /><br />
      <hr />
      <br />

      <h2>Sign Up with Google</h2>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => alert('Google signup error')}
      />

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

export default HomePage;
