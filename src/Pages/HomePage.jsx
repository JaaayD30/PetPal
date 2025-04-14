import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to PetPal!</h1>
        <p>Your one-stop app for connecting with pet blood donors in emergencies</p>

        {/* Link to the Sign Up page */}
        <Link to="/user-details">
          <button
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
