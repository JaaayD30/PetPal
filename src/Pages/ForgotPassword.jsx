import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // React Router v6+
import axios from 'axios';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Disable browser back navigation on this page
  useEffect(() => {
    // Push the current state so back button stays here
    window.history.pushState(null, '', window.location.href);

    const onPopState = () => {
      // When back button pressed, push state again so user stays here
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email });

      setMessage(res.data.message || 'If your email is registered, a reset link will be sent.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', width: '100%', marginTop: '5px', marginBottom: '10px' }}
          />
        </div>
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
          Send Reset Link
        </button>
      </form>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '1rem',
          padding: '10px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Back to Homepage
      </button>
    </div>
  );
}
