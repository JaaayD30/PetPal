import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import HomePage from './Pages/HomePage';
import UserDetailsPage from './Pages/UserDetailsPage'; // Keep or replace with UserDetails if needed
import ConfirmationPage from './Pages/ConfirmationPage';
import LandingPage from './Pages/LandingPage';
import ProfilePage from './Pages/Profile';

// Import UserDetails if it's a separate component you want to use
// import UserDetails from './UserDetails'; 

function App() {
  return (
    <GoogleOAuthProvider clientId="523925700451-f5rmmu0jghctco3qr5l293orh6d8qgcu.apps.googleusercontent.com">
      {/* Wrap with GoogleOAuthProvider */}
      <Router>
        <nav>
          <ul style={{ display: 'flex', listStyleType: 'none' }}>
            <li style={{ marginRight: '1rem' }}>
              {/* this is for navigation*/}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* If using UserDetailsPage for user info, this route is correct */}
          <Route path="/user-details" element={<UserDetailsPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path='/profile' element={<ProfilePage/>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
