import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


const HomePage = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', loginData);
      alert(res.data.message);
  
      // Store both user info and token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
  
      setUserData(res.data.user);
      navigate('/landing');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      const googleEmail = decoded.email;

      const res = await axios.post('http://localhost:5000/api/check-email', {
        email: googleEmail,
      });

      if (res.data.exists) {
        alert('Email is already registered. Please log in instead.');
      } else {
        localStorage.setItem('googleEmail', googleEmail);
        navigate('/user-details');
      }
    } catch (err) {
      console.error('JWT decode or email check failed:', err);
      alert('Google login failed or server error');
    }
  };

  return (
      <div style={{
        position: 'fixed', // Prevent scroll
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#eaf6ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
        }}>

      <div style={{
        backgroundColor: 'white',
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '350px',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <img
          src="/Images/Logo.png" // <-- Make sure this image exists in your public/images folder
          alt="Pet Logo"
          style={{ width: '150px', height: '110px', marginBottom: '10px' }}
        />
        <h1 style={{
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '25px'
        }}>PetPAL</h1>

        {/* Login form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleLoginChange}
            required
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#f28b39',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        {/* Signup */}
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Haven't made an account?</span>
        </div>

        {/* Social login */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold' }}>Sign Up</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert('Google signup error')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
