import { useState } from 'react';

function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate successful sign up
    setSuccess('Account created successfully!');
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
          maxWidth: '450px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>PetPal</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
          )}

          {success && (
            <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>
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
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a
            href="#"
            style={{ fontSize: '0.9rem', color: 'blue', textDecoration: 'none' }}
            onClick={() => alert('Redirect to login')}
          >
            Already have an account? Log in
          </a>
        </div>
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

export default SignUpPage;
