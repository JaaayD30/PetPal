import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import UserDetailsPage from './Pages/UserDetailsPage';
import ConfirmationPage from './Pages/ConfirmationPage';
import LandingPage from './Pages/LandingPage';


function App() {
  return (
    <GoogleOAuthProvider clientId="523925700451-f5rmmu0jghctco3qr5l293orh6d8qgcu.apps.googleusercontent.com"> {/* Wrap with GoogleOAuthProvider */}
      <Router>
        <nav>
          <ul style={{ display: 'flex', listStyleType: 'none' }}>
            <li style={{ marginRight: '1rem' }}>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-details" element={<UserDetailsPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;