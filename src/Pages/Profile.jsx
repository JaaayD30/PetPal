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
        password: editableUser.password,
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
          disabled={!isEditing}
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
          disabled={!isEditing}
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
          disabled={!isEditing}
        />
      </div>

      <div>
  <label style={labelStyle}>PASSWORD:</label>
  {!isEditing ? (
    <input
      type="password"
      value={'********'}
      readOnly
      style={{ ...inputStyle, letterSpacing: '0.3em' }}
    />
  ) : (
    <input
      type="text"
      name="password"
      value={editableUser.password}
      onChange={handleChange}
      style={inputStyle}
      autoComplete="new-password"
    />
  )}
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
          style={{
            padding: '10px',
            backgroundColor: '#f28b39',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
          }}
          type="button"
        >
          Reset Password
        </button>
      </div>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} style={{ marginTop: '10px', marginRight: '10px' }}>
          Edit Profile
        </button>
      ) : (
        <>
          <button onClick={handleSave} style={{ marginTop: '10px', marginRight: '10px' }}>
            Save Changes
          </button>
          <button onClick={handleCancel} style={{ marginTop: '10px', marginRight: '10px' }}>
            Cancel
          </button>
        </>
      )}

      <button onClick={handleLogout} style={{ marginTop: '10px' }}>
        Log Out
      </button>
    </div>
  );
};

export default ProfilePage;
