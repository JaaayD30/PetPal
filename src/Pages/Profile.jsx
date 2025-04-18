import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userFromState = location.state;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (userFromState) {
      setUser(userFromState);
      setEditableUser(userFromState);
      localStorage.setItem('user', JSON.stringify(userFromState));
    } else if (storedUser) {
      setUser(storedUser);
      setEditableUser(storedUser);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/update-user/${user.id}`, {
        fullName: editableUser.fullName,
        username: editableUser.username,
        password: editableUser.password,
        address: editableUser.address,
        phone: editableUser.phone,
      });

      const updatedUser = response.data.user;
      setUser(updatedUser);
      setEditableUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (!editableUser) return <p>Loading...</p>;

  const inputStyle = {
    border: '1px solid #ccc',
    padding: '10px 15px',
    borderRadius: '6px',
    width: '300px',
    fontSize: '16px',
    marginBottom: '20px',
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
        <input
          type="text"
          name="username"
          value={editableUser.username}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>EMAIL:</label>
        <input
          type="email"
          value={editableUser.email}
          readOnly
          style={{ ...inputStyle, backgroundColor: '#eee' }}
        />
      </div>

      <div>
        <label style={labelStyle}>ADDRESS:</label>
        <input
          type="text"
          name="address"
          value={editableUser.address}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>PHONE:</label>
        <input
          type="text"
          name="phone"
          value={editableUser.phone}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>PASSWORD:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={editableUser.password}
          onChange={handleChange}
          style={inputStyle}
        />
        <button onClick={togglePasswordVisibility} style={{ marginBottom: '20px' }}>
          {showPassword ? 'Hide' : 'See'}
        </button>
      </div>

      <button onClick={handleSave} style={{ marginRight: '10px' }}>
        Save Changes
      </button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProfilePage;
