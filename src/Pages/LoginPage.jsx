import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    if (username === 'user' && password === 'password') {
      alert('Login successful!');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>PetPal</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '0.75rem',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '0.75rem',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Link
            to="/signup"
            style={{
            fontSize: '0.9rem',
            color: 'blue',
            textDecoration: 'none',
    }}
  >
    Don’t have an account?
  </Link>
</div>


          {error && (
            <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
