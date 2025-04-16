import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    } else {
      // If no user is found, redirect to login page
      window.location.href = '/login';
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default ProfilePage;
