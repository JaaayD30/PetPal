import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmationPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Assume the verification code is '123456' for demonstration
    if (verificationCode === '123456') {
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login page after success
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>PetPal</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Enter Verification Code</h2>
        <form onSubmit={handleVerificationSubmit}>
          <input
            type="text"
            placeholder="Enter the code sent to your email"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={inputStyle}
          />

          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}

          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem',
  width: '100%',
  marginBottom: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

export default ConfirmationPage;
