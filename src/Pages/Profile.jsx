import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    } else {
      // If no user is found, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to the login page
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>
        <strong>Password:</strong> 
        {/* Conditionally render password based on showPassword state */}
        {showPassword ? user.password : '********'}
        <button onClick={togglePasswordVisibility}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
      </p>
      {/* Log Out Button */}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProfilePage;
