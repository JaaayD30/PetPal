import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      <p>
        <strong>Password:</strong> 
        {/* Conditionally render the password */}
        {showPassword ? user.password : '******'}
        <button onClick={togglePasswordVisibility}>
          {showPassword ? 'Hide Password' : 'See Password'}
        </button>
      </p>

      {/* Log Out Button */}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProfilePage;
