import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cardData = [
  { id: 1, name: 'Buddy', type: 'Golden Retriever', location: 'Davao City' },
  { id: 2, name: 'Milo', type: 'Siberian Husky', location: 'Tagum City' },
  { id: 3, name: 'Luna', type: 'Persian Cat', location: 'Panabo' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('googleEmail');
    navigate('/');
    console.log('User logged out');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cardData.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cardData.length) % cardData.length);
  };

  const currentCard = cardData[currentCardIndex];

  return (
    <div style={styles.container}>
      {/* NAVIGATION HEADER */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>🐾 PetPal</div>
        <div style={styles.searchContainer}>
          <input type="text" placeholder="Search..." style={styles.searchInput} />
        </div>
        <div style={styles.profileSection}>
          <button onClick={toggleDropdown} style={styles.profileIcon}>👤</button>
          {dropdownOpen && (
            <div style={styles.dropdown}>
              <button onClick={handleProfile} style={styles.dropdownItem}>View Profile</button>
              <button onClick={handleLogout} style={styles.dropdownItem}>Log Out</button>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to PetPal</h1>
        <p style={styles.subtitle}>Connecting Pet Owners with Potential Blood Donors</p>
      </header>

      {/* SWIPEABLE CARDS */}
      <section style={styles.cardSection}>
        <button onClick={handlePrev} style={styles.arrowButton}>⬅️</button>

        <div style={styles.card}>
          <h3>{currentCard.name}</h3>
          <p>Type: {currentCard.type}</p>
          <p>Location: {currentCard.location}</p>
        </div>

        <button onClick={handleNext} style={styles.arrowButton}>➡️</button>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 PetPal. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5b9f85',
    padding: '10px 20px',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    width: '60%',
    maxWidth: '400px',
    fontSize: '16px',
  },
  profileSection: {
    position: 'relative',
  },
  profileIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '40px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '10px 15px',
    backgroundColor: '#fff',
    color: '#333',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
  },
  header: {
    textAlign: 'center',
    backgroundColor: '#5b9f85',
    padding: '30px',
    color: '#fff',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
  },
  cardSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: '40px',
  },
  card: {
    backgroundColor: '#e9f7f1',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    minWidth: '300px',
    maxWidth: '400px',
    textAlign: 'center',
    margin: '0 20px',
  },
  arrowButton: {
    fontSize: '30px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
  },
};

export default LandingPage;
