import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

    const fetchProfilePicture = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile-picture', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileImage(response.data.image || null);
      } catch (error) {
        console.error('Error fetching profile image', error);
      }
    };

    fetchProfilePicture();
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && (!/^\d*$/.test(value) || value.length > 11)) return;
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          const token = localStorage.getItem('token');
          await axios.put(
            'http://localhost:5000/api/users/profile-picture',
            { image: base64String },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProfileImage(`data:image/jpeg;base64,${base64String}`);
          alert('Profile picture updated!');
        } catch (err) {
          console.error('Error uploading image', err);
          alert('Failed to upload profile picture.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!editableUser) return <p>Loading...</p>;

  // Styles
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

  const resetButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#f28b39',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    marginBottom: '20px',
  };


  const simpleButtonStyle = {
    padding: '10px 16px',
    fontSize: '15px',
    border: '1px solid #333',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  };

  const hoverStyle = {
    backgroundColor: '#f5f5f5',
    textDecoration: 'underline',
    transform: 'scale(1.03)',
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: '843px',
          borderRadius: '6px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'white',
          padding: '60px',
        }}
      >
        <img
          src="/Images/Logo.png"
          alt="PetPal Logo"
          style={{ width: '240px', display: 'block', margin: '0 auto 20px' }}
        />

        <h1
          style={{
            textAlign: 'center',
            fontFamily: "'Crimson Text', serif",
            fontSize: '45px',
            marginTop: '20px',
            marginBottom: '30px',
          }}
        >
          Welcome To PetPal, {user.fullName}
        </h1>

        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          {profileImage && (
            <img
              src={selectedImage || profileImage}
              alt="Profile"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
          )}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: '10px' }}
            />
          )}
        </div>

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
            <input type="email" value={editableUser.email} readOnly style={inputStyle} />
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
            onMouseEnter={() => setHoveredButton('reset')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...simpleButtonStyle,
              marginTop: '20px',
              marginBottom: '40px',
              ...(hoveredButton === 'reset' ? hoverStyle : {}),
            }}
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
            <button
              onClick={() => setIsEditing(true)}
              onMouseEnter={() => setHoveredButton('edit')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                ...simpleButtonStyle,
                ...(hoveredButton === 'edit' ? hoverStyle : {}),
              }}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                onMouseEnter={() => setHoveredButton('save')}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  ...simpleButtonStyle,
                  ...(hoveredButton === 'save' ? hoverStyle : {}),
                }}
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                onMouseEnter={() => setHoveredButton('cancel')}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  ...simpleButtonStyle,
                  ...(hoveredButton === 'cancel' ? hoverStyle : {}),
                }}
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredButton('logout')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...simpleButtonStyle,
              ...(hoveredButton === 'logout' ? hoverStyle : {}),
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
