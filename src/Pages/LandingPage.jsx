import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    bloodType: '',
    age: '',
    address: '',
    images: [],
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result].slice(0, 5),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newCard = {
      ...formData,
      id: Date.now(),
    };
    setCards((prev) => [...prev, newCard]);
    setShowForm(false);
    setFormData({
      name: '',
      breed: '',
      bloodType: '',
      age: '',
      address: '',
      images: [],
    });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleImageNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentCard.images.length);
  };

  const handleImagePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentCard.images.length) % currentCard.images.length);
  };

  const currentCard = cards[currentCardIndex] || null;

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
        {cards.length > 0 ? (
          <>
            <button onClick={handlePrev} style={styles.arrowButton}>⬅️</button>
            <div style={styles.card}>
            {currentCard.images?.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                  {currentCard.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`pet-${idx}`}
                      onClick={() => handleImageClick(idx)}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              )}
              <h3>{currentCard.name}</h3>
              <p>Breed: {currentCard.breed}</p>
              <p>Blood Type: {currentCard.bloodType}</p>
              <p>Age: {currentCard.age}</p>
              <p>Address: {currentCard.address}</p>
            </div>
            <button onClick={handleNext} style={styles.arrowButton}>➡️</button>
          </>
        ) : (
          <p style={{ fontSize: '18px', color: '#888' }}>No pets added yet.</p>
        )}
      </section>

      {/* FULLSCREEN IMAGE MODAL */}
      {isImageModalOpen && currentCard?.images?.length > 0 && (
        <div style={styles.imageModal}>
          <button onClick={() => setIsImageModalOpen(false)} style={styles.imageModalClose}>✕</button>
          <button onClick={handleImagePrev} style={styles.imageModalNavLeft}>⬅️</button>
          <img
            src={currentCard.images[currentImageIndex]}
            alt="fullscreen"
            style={styles.imageModalImg}
          />
          <button onClick={handleImageNext} style={styles.imageModalNavRight}>➡️</button>
        </div>
      )}

      {/* POPUP FORM */}
      {showForm && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Pet Details</h2>
            <form onSubmit={handleFormSubmit}>
              <label style={styles.formLabel}>Upload Images (Max 5)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} style={styles.formInput} />

              <label style={styles.formLabel}>Pet Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.formInput} />
              <select name="breed" value={formData.breed} onChange={handleChange} required style={styles.formInput} >
              <option value="">Select Breed</option>
              <option value="Aspin">Aspin</option>
              <option value="Shih Tzu">Shih Tzu</option>
              <option value="Chihuahua">Chihuahua</option>
              <option value="Pomeranian">Pomeranian</option>
              <option value="Labrador Retriever">Labrador Retriever</option>
              <option value="Siberian Husky">Siberian Husky</option>
              <option value="Pug">Pug</option>
              <option value="Beagle">Beagle</option>
              </select>
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
    minHeight: '300px',
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
  imageModal: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalImg: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '10px',
  },
  imageModalClose: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    fontSize: '32px',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  imageModalNavLeft: {
    position: 'absolute',
    left: '30px',
    fontSize: '40px',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  imageModalNavRight: {
    position: 'absolute',
    right: '30px',
    fontSize: '40px',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
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
