import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (!/^\d*$/.test(value) || value.length > 11) return;
    }

    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/update-user/${user.id}`, {
        fullName: editableUser.fullName,
        username: editableUser.username,
        address: editableUser.address,
        phone: editableUser.phone,
      });
  
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setEditableUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  
  

  const handleCancel = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  if (!editableUser) return <p>Loading...</p>;

  const inputStyle = {
    fontFamily: "'Crimson Text', serif",
    border: '2px solid #FA9A51',
    padding: '14px 20px',
    borderRadius: '8px',
    width: '350px',
    fontSize: '22px',
    marginBottom: '20px',
    outline: 'none',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const resetButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f28b39',
    marginTop: '10px',
    marginBottom: '20px',
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: '843px',
          height: '881px',
          borderRadius: '6px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'white',
          padding: '60px',
          overflowY: 'auto',
        }}
      >
        <img
          src="/Images/Logo.png"
          alt="PetPal Logo"
          style={{ width: '240px', height: 'auto', display: 'block', margin: '0 auto 20px' }}
        />

        <h1
          style={{
            textAlign: 'center',
            fontFamily: "'Crimson Text', serif",
            fontSize: '45px',
            marginTop: '20px',
            marginBottom: '50px',
          }}
        >
          Welcome To PetPal, {user.fullName}
        </h1>

        <div>
            <label style={labelStyle}>FullName:</label>
            <input
              type="text"
              name="fullName"
              value={editableUser.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              style={inputStyle}
            />
          </div>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>USERNAME:</label>
            <input
              type="text"
              name="username"
              value={editableUser.username}
              onChange={handleChange}
              disabled={!isEditing}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>EMAIL:</label>
            <input
              type="email"
              value={editableUser.email}
              readOnly
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>ADDRESS:</label>
            <input
              type="text"
              name="address"
              value={editableUser.address}
              onChange={handleChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
  <label style={labelStyle}>PASSWORD:</label>
  <input
    type="password"
    value="******"
    readOnly
    style={{ ...inputStyle, letterSpacing: '0.3em' }}
  />
</div>


        <div>
          <button
            onClick={async () => {
              try {
                const res = await axios.post('http://localhost:5000/api/forgot-password', {
                  email: user.email,
                });
                alert(res.data.message || 'Reset link sent to your email.');
              } catch {
                alert('Failed to send reset link.');
              }
            }}
            style={resetButtonStyle}
            type="button"
          >
            Reset Password
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            display: 'flex',
            gap: '10px',
          }}
        >
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} style={buttonStyle}>
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} style={buttonStyle}>
                Save Changes
              </button>
              <button onClick={handleCancel} style={{ ...buttonStyle, backgroundColor: '#ccc' }}>
                Cancel
              </button>
            </>
          )}
          <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
