import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';




const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Decoded Google User:', decoded);

    // Save email to localStorage
    localStorage.setItem('googleEmail', decoded.email);

    // Navigate to user details page
    navigate('/user-details');
  };

  const handleLoginFailure = (error) => {
    console.log('Login Failed:', error);
  };

  return (
    <div>
      <h1>Welcome to PetPal!</h1>
      <p>Your one-stop app for connecting with pet blood donors in emergencies</p>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} />
    </div>
  );
};

export default HomePage;
