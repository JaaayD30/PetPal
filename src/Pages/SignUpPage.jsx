import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function SignUpPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Google login success handler
  const handleGoogleSuccess = (response) => {
    console.log('Google login successful:', response);  // Log the response for debugging
    
    // After Google login success, redirect to UserDetailsPage for additional information
    navigate('/user-details', { state: { googleResponse: response } });
  };

  // Google login failure handler
  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
    setError('Google login failed. Please try again.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>PetPal</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        {/* Google Login Button */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            clientId="523925700451-f5rmmu0jghctco3qr5l293orh6d8qgcu.apps.googleusercontent.com"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
