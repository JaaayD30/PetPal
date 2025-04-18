import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userFromState = location.state;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (userFromState) {
      setUser(userFromState);
      localStorage.setItem('user', JSON.stringify(userFromState));
    } else if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        {showPassword ? user.password : '******'}{' '}
        <button onClick={togglePasswordVisibility}>
          {showPassword ? 'Hide Password' : 'See Password'}
        </button>
      </p>

      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProfilePage;
