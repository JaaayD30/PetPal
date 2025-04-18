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

  const boxStyle = {
    border: '1px solid #ccc',
    padding: '10px 15px',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9',
    width: '300px',
    fontSize: '16px',
    marginBottom: '20px'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user.fullName}</h1>

      <div>
        <label style={labelStyle}>USERNAME:</label>
        <div style={boxStyle}>{user.username}</div>
      </div>

      <div>
        <label style={labelStyle}>EMAIL:</label>
        <div style={boxStyle}>{user.email}</div>
      </div>

      <div>
        <label style={labelStyle}>ADDRESS:</label>
        <div style={boxStyle}>{user.address}</div>
      </div>

      <div>
        <label style={labelStyle}>PHONE:</label>
        <div style={boxStyle}>{user.phone}</div>
      </div>

      <div>
        <label style={labelStyle}>PASSWORD:</label>
        <div style={boxStyle}>
          {showPassword ? user.password : '******'}
          <button onClick={togglePasswordVisibility} style={{ marginLeft: '10px' }}>
            {showPassword ? 'Hide' : 'See'}
          </button>
        </div>
      </div>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Log Out
      </button>
    </div>
  );
};

export default ProfilePage;
