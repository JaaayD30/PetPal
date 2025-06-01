import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[@$!%*?&#]/.test(password)) strength += 1;

  switch (strength) {
    case 5:
      return { label: 'Very Strong', color: 'green' };
    case 4:
      return { label: 'Strong', color: 'limegreen' };
    case 3:
      return { label: 'Medium', color: 'orange' };
    case 2:
      return { label: 'Weak', color: 'orangered' };
    default:
      return { label: 'Very Weak', color: 'red' };
  }
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/reset-password', {
        token,
        newPassword,
      });

      setMessage(res.data.message || 'Password successfully changed!');
      setResetSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    padding: '8px',
    width: '100%',
    marginBottom: '10px',
    border: hasError ? '2px solid red' : '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
  });

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Reset Password</h2>

      {message && <p style={{ color: resetSuccess ? 'green' : 'red' }}>{message}</p>}

      {!resetSuccess && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password</label><br />
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={inputStyle(error && newPassword !== confirmPassword)}
            />
            {newPassword && (
              <small style={{ color: strength.color }}>
                Password Strength: {strength.label}
              </small>
            )}
          </div>

          <div>
            <label>Confirm Password</label><br />
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle(error && newPassword !== confirmPassword)}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={() => setShowPasswords(!showPasswords)}
              />{' '}
              Show Passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px',
              backgroundColor: '#f28b39',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            {loading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 8 }}
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-loader spin"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
            )}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {/* Back to Login button is always visible */}
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
        Back to Login
      </button>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}
