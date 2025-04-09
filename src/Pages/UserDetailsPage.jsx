import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [googleResponse, setGoogleResponse] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get Google login response passed from SignUpPage
    if (location.state && location.state.googleResponse) {
      setGoogleResponse(location.state.googleResponse);
    } else {
      navigate('/signup'); // If no Google response, redirect back to the signup page
    }
  }, [location, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !username) {
      setError('All fields are required');
      return;
    }

    // Save user details (e.g., send to the backend)
    console.log('User details:', { googleResponse, fullName, username });

    // Redirect to the landing page after successful submission
    navigate('/landing');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>PetPal</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Complete Your Sign Up</h2>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
            Complete Sign Up
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

export default UserDetailsPage;
