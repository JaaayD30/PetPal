import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [petCards, setPetCards] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    bloodType: '',
    age: '',
    address: '',
  });

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
    setCurrentCardIndex((prev) => (prev + 1) % petCards.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + petCards.length) % petCards.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setPetCards((prev) => [...prev, formData]);
    setShowForm(false);
    setFormData({ name: '', breed: '', bloodType: '', age: '', address: '' });
    setCurrentCardIndex(petCards.length); // set to the newly added card
  };

  const currentCard = petCards[currentCardIndex];

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
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

      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to PetPal</h1>
        <p style={styles.subtitle}>Connecting Pet Owners with Potential Blood Donors</p>
      </header>

      {/* CARD SECTION */}
      <section style={styles.cardSection}>
        {petCards.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
            No pet donors added yet. Click the ＋ button to add one.
          </div>
        ) : (
          <>
            <button onClick={handlePrev} style={styles.arrowButton}>⬅️</button>
            <div style={styles.card}>
              <h3>{currentCard.name}</h3>
              <p>Breed: {currentCard.breed}</p>
              <p>Blood Type: {currentCard.bloodType}</p>
              <p>Age: {currentCard.age}</p>
              <p>Address: {currentCard.address}</p>
            </div>
            <button onClick={handleNext} style={styles.arrowButton}>➡️</button>
          </>
        )}
      </section>

      {/* POPUP FORM */}
      {showForm && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Pet Details</h2>
            <form onSubmit={handleFormSubmit}>
              <label style={styles.formLabel}>Pet Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.formInput} />
              <label style={styles.formLabel}>Breed</label>
              <input type="text" name="breed" value={formData.breed} onChange={handleChange} required style={styles.formInput} />
              <label style={styles.formLabel}>Blood Type</label>
              <input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} required style={styles.formInput} />
              <label style={styles.formLabel}>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required style={styles.formInput} />
              <label style={styles.formLabel}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.formInput} />

              <div style={styles.formButtonGroup}>
                <button type="submit" style={styles.submitButton}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button onClick={() => setShowForm(true)} style={styles.fab}>＋</button>

      {/* FOOTER */}
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
  fab: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#5b9f85',
    color: '#fff',
    fontSize: '32px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    width: '95%',
    maxWidth: '450px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
  },
  formInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  formButtonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  submitButton: {
    backgroundColor: '#5b9f85',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default LandingPage;
