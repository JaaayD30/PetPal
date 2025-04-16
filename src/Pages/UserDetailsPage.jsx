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
  });

  const navigate = useNavigate();

  // Automatically fill email from Google login
  useEffect(() => {
    const emailFromGoogle = localStorage.getItem('googleEmail');
    if (emailFromGoogle) {
      setFormData((prev) => ({ ...prev, email: emailFromGoogle }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/signup', formData);
      alert(res.data.message);

      // Store user details in localStorage including password
      localStorage.setItem('user', JSON.stringify({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password, // Store password (for demo purposes only)
      }));

      // Redirect to the profile page
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
        value={formData.fullName}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        value={formData.username}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
        required
        readOnly={!!formData.email} // Make it readonly if prefilled
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        value={formData.password}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleChange}
        value={formData.confirmPassword}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default UserDetailsPage;
