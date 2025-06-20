import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import HomePage from './Pages/HomePage';
import UserDetailsPage from './Pages/UserDetailsPage'; // Keep or replace with UserDetails if needed
import ConfirmationPage from './Pages/ConfirmationPage';
import LandingPage from './Pages/LandingPage';
import ProfilePage from './Pages/Profile';
import PetDetails from './Pages/PetDetails';
import ResetPassword from './Pages/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword';
import FavoritesPage from './Pages/FavoritesPage';
import MatchDetailsPage from './Pages/MatchDetailsPage';
import ConnectedMatches from './Pages/ConnectedMatches';
import Maps from './Pages/Maps';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
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
          <Route path='/pets' element={<PetDetails/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/favorites' element={<FavoritesPage/>} />
          <Route path='/match-details/:userId' element={<MatchDetailsPage />} />
          <Route path='/connectedmatches' element={<ConnectedMatches />} />
          <Route path='/maps' element={<Maps />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
