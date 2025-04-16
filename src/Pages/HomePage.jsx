import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLoginSuccess = (response) => {
    console.log(response); // Log response to see if it's correct
    // After successful login, navigate to user details
    navigate('/user-details');
  };

  const handleLoginFailure = (error) => {
    console.log(error); // Log failure details for debugging
  };

  return (
    <div>
      <h1>Welcome to PetPal!</h1>
      <p>Your one-stop app for connecting with pet blood donors in emergencies</p>

      {/* Google Login Button */}
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}  // Ensure this is correct
      />
    </div>
  );
};

export default HomePage;
