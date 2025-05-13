import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDetailsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });

  const [isAcknowledged, setIsAcknowledged] = useState(false); // New state for checkbox
  const navigate = useNavigate();

  useEffect(() => {
    const emailFromGoogle = localStorage.getItem('googleEmail');
    if (emailFromGoogle) {
      setFormData((prev) => ({ ...prev, email: emailFromGoogle }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsAcknowledged(e.target.checked); // Update checkbox state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!isAcknowledged) { // Check if the checkbox is ticked
      alert('You must acknowledge that we are collecting your personal details');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/signup', formData);

      const storedUser = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
        password: formData.password,
      };

      localStorage.setItem('user', JSON.stringify(storedUser));
      alert(res.data.message || 'Signup successful!');

      navigate('/', { state: storedUser });
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#eaf6ff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
      }}>
        
        {/* Form Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px 40px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          width: '45%',
          textAlign: 'center'
        }}>
          <img
            src="/Images/Logo.png" 
            alt="Pet Logo"
            style={{ width: '150px', height: '110px', marginBottom: '10px' }}
          />
          <h1 style={{
            fontSize: '26px',
            fontWeight: 'bold',
            marginBottom: '25px'
          }}>Complete Your Profile</h1>

          {/* Signup form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.fullName}
              required
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={formData.username}
              required
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
              readOnly={!!formData.email}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              value={formData.address}
              required
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              value={formData.phone}
              required
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            />

            {/* Acknowledgment checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="acknowledge"
                checked={isAcknowledged}
                onChange={handleCheckboxChange}
                required
              />
              <label htmlFor="acknowledge" style={{ fontSize: '14px', color: '#555' }}>
                I acknowledge that PetPal will be collecting my personal and my companions information.
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: '10px',
                backgroundColor: '#f28b39',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Message Section */}
        <div style={{
          width: '45%',
          padding: '30px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f28b39' }}>🐾 Welcome to PetPal!</h2>
          <p style={{ fontSize: '18px', color: '#555' }}>
            Your pet’s lifesaver network.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#777',
            lineHeight: '1.5',
            marginTop: '20px',
            textAlign: 'left'
          }}>
            PetPal is a compassionate platform designed to connect pet owners with a community of nearby pets based on vital details like blood type, location, and more. Whether you're in need of a donor for your furry friend or simply want to register your pet to help others in emergencies — you're in the right place.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#777',
            lineHeight: '1.5',
            marginTop: '20px',
            textAlign: 'left'
          }}>
            Get started by adding your pet now!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
