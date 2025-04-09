import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const navigate = useNavigate();

  // Google login success and failure handlers
  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login successful:', response);
    // You can send the response token to your server for validation
    navigate('/landing'); // Redirect to LandingPage after successful login
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
    // Show an error message if needed
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>

      {/* Google Login Button */}
      <div style={{ marginTop: '1rem' }}>
        <GoogleLogin 
          onSuccess={handleGoogleLoginSuccess} 
          onError={handleGoogleLoginFailure}
          clientId="YOUR_GOOGLE_CLIENT_ID" // Replace with your actual Client ID
        />
      </div>
    </div>
  );
}

export default LoginPage;
