import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const token = localStorage.getItem('token'); // JWT or OAuth token key
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    images: [],
    name: '',
    breed: '',
    bloodType: '',
    age: '',
    sex: '',
    address: '',
    kilos: '',
    details: '',
  });
  const [expandedPetIndex, setExpandedPetIndex] = useState(null);

  const toggleExpandPet = (index) => {
    setExpandedPetIndex(prev => (prev === index ? null : index));
  };
  

  useEffect(() => {
    fetch('http://localhost:5000/api/all-pets')
      .then(res => res.json())
      .then(data => {
        setPets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pets:', err);
        setLoading(false);
      });
  }, []);
  

  // Show loading state if pets not loaded yet

  const currentPet = pets[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? pets.length - 1 : prev - 1));

  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === pets.length - 1 ? 0 : prev + 1));

  };

  const handleLogout = () => {
    localStorage.removeItem('googleEmail');
    localStorage.removeItem('token');
    navigate('/');
    console.log('User logged out');
  };

  const handleProfile = () => navigate('/profile');
  const handlePets = () => navigate('/pets');
  const toggleDropdown = () => setDropdownOpen(open => !open);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    // Read all files asynchronously and update images array once all are loaded
    Promise.all(
      files.map(file =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
      )
    ).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images].slice(0, 5),
      }));
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('You must be logged in to add a pet.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Failed to save pet: ' + (errorData.message || 'Unknown error'));
        return;
      }

      const data = await response.json();
      alert('Pet added successfully!');
      setPets(prev => [...prev, data.pet]);
      setShowForm(false);
      setFormData({
        images: [],
        name: '',
        breed: '',
        bloodType: '',
        age: '',
        sex: '',
        address: '',
        kilos: '',
        details: '',
      });
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('An error occurred while saving the pet.');
    }
  };

  return (
    <div style={styles.pageContainer}>
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
              <button onClick={handlePets} style={styles.dropdownItem}>Pets</button>
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

{/* PET CARD + NAVIGATION */}
<div style={styles.cardNavigation}>
  <button onClick={handlePrev} style={styles.navButton}>Prev</button>

  {/* Only show clickable card (not expanded) if not expanded */}
  {expandedPetIndex !== currentIndex && (
    <div
      style={styles.card}
      onClick={() => toggleExpandPet(currentIndex)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          toggleExpandPet(currentIndex);
        }
      }}
    >
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading pets...</div>
      ) : pets.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>No pets to display</div>
      ) : (
        <>
          <h2>{pets[currentIndex].name}</h2>
          <div style={styles.cardContent}>
            <div style={styles.imageSection}>
              {Array.isArray(pets[currentIndex].images) && pets[currentIndex].images.length > 0 ? (
                pets[currentIndex].images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${pets[currentIndex].name} image ${idx + 1}`}
                    style={styles.largeImage}
                    loading="lazy"
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div style={styles.detailsSection}>
              <p><b>Breed:</b> {pets[currentIndex].breed}</p>
              <p><b>Blood Type:</b> {pets[currentIndex].blood_type}</p>
              <p><b>Age:</b> {pets[currentIndex].age}</p>
              <p><b>Sex:</b> {pets[currentIndex].sex}</p>
              <p><b>Weight (kgs):</b> {pets[currentIndex].kilos}</p>
              <p><b>Address:</b> {pets[currentIndex].address}</p>
              <p><b>Details:</b> {pets[currentIndex].details}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )}

  {/* Expanded modal */}
  {expandedPetIndex === currentIndex && (
    <div
      style={styles.modalOverlay}
      onClick={() => toggleExpandPet(null)} // Close modal on overlay click
    >
      <div
        style={{ ...styles.card, ...styles.cardExpanded }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
        role="dialog"
        tabIndex={-1}
      >
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading pets...</div>
        ) : pets.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>No pets to display</div>
        ) : (
          <>
            <h2>{pets[currentIndex].name}</h2>
            <div style={styles.cardContent}>
              <div style={styles.imageSection}>
                {Array.isArray(pets[currentIndex].images) && pets[currentIndex].images.length > 0 ? (
                  pets[currentIndex].images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${pets[currentIndex].name} image ${idx + 1}`}
                      style={styles.largeImage}
                      loading="lazy"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <div style={styles.detailsSection}>
                <p><b>Breed:</b> {pets[currentIndex].breed}</p>
                <p><b>Blood Type:</b> {pets[currentIndex].blood_type}</p>
                <p><b>Age:</b> {pets[currentIndex].age}</p>
                <p><b>Sex:</b> {pets[currentIndex].sex}</p>
                <p><b>Weight (kgs):</b> {pets[currentIndex].kilos}</p>
                <p><b>Address:</b> {pets[currentIndex].address}</p>
                <p><b>Details:</b> {pets[currentIndex].details}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )}

  <button onClick={handleNext} style={styles.navButton}>Next</button>
</div>



      {/* POPUP FORM */}
      {showForm && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Pet Details</h2>
            <form onSubmit={handleFormSubmit}>
              <label style={styles.formLabel}>Upload Images (Max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Pet Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                style={styles.formInput}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label style={styles.formLabel}>Breed</label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                style={styles.formInput}
              >
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
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                style={styles.formInput}
              >
                <option value="">Select Blood Type</option>
                <option value="DEA 1.1 positive">DEA 1.1 positive</option>
                <option value="DEA 1.1 negative">DEA 1.1 negative</option>
                <option value="DEA 1.2 positive">DEA 1.2 positive</option>
                <option value="DEA 1.2 negative">DEA 1.2 negative</option>
                <option value="DEA 3 positive">DEA 3 positive</option>
                <option value="DEA 3 negative">DEA 3 negative</option>
                <option value="DEA 4 positive">DEA 4 positive</option>
                <option value="DEA 4 negative">DEA 4 negative</option>
                <option value="DEA 5 positive">DEA 5 positive</option>
                <option value="DEA 5 negative">DEA 5 negative</option>
                <option value="DEA 7 positive">DEA 7 positive</option>
                <option value="DEA 7 negative">DEA 7 negative</option>
                <option value="Dal positive">Dal positive</option>
                <option value="Dal negative">Dal negative</option>
                <option value="No common blood group">No common blood group</option>
              </select>

              <label style={styles.formLabel}>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Weight (Kilos)</label>
              <input
                type="number"
                name="kilos"
                value={formData.kilos}
                onChange={handleChange}
                required
                min="0"
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ ...styles.formInput, height: '60px' }}
              />

              <label style={styles.formLabel}>Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                style={{ ...styles.formInput, height: '60px' }}
              />

              <div style={styles.formButtons}>
                <button type="submit" style={styles.submitButton}>Save Pet</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        style={styles.floatingButton}
        title="Add Pet"
      >
        +
      </button>
    </div>
  );
};

const styles = {
  // Nav & layout
  cardNavigation: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },

  navButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#f28b39',
    color: 'white',
    cursor: 'pointer',
    userSelect: 'none',
  },

  // Card styles
  card: {
    cursor: 'pointer',
    backgroundColor: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '0 1rem',
  },

  cardExpanded: {
    maxWidth: '600px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    cursor: 'default', // Not clickable when expanded
  },

  // Modal overlay for expanded pet card
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  // Card content inside the card/modal
  cardContent: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },

  imageSection: {
    flex: '1 1 40%',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  },

  largeImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },

  detailsSection: {
    flex: '1 1 60%',
    fontSize: '1.1rem',
    color: '#333',
    lineHeight: '1.4',
  },

  // Other styles (navbar, search, dropdown, form, etc.) remain unchanged
  navbar: {
    backgroundColor: '#f28b39',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    color: 'white',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginRight: 'auto',
  },

  searchContainer: {
    width: '300px',
    margin: '0 auto',
  },

  searchInput: {
    width: '100%',
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    border: 'none',
    fontSize: '1rem',
  },

  profileSection: {
    position: 'relative',
    marginLeft: 'auto',
  },

  profileIcon: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },

  dropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    backgroundColor: 'white',
    color: '#333',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
  },

  dropdownItem: {
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },

  header: {
    textAlign: 'center',
    marginTop: '1rem',
  },

  title: {
    fontSize: '2.4rem',
    color: '#334e68',
    marginBottom: '0.25rem',
  },

  subtitle: {
    fontSize: '1.1rem',
    color: '#557a95',
    marginTop: 0,
  },

  imagesContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },

  thumbnail: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '5px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.3s',
  },

  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 100,
  },

  modalImage: {
    maxWidth: '90vw',
    maxHeight: '80vh',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(255,255,255,0.5)',
  },

  popupOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  popup: {
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '480px',
    padding: '1.5rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },

  formLabel: {
    marginTop: '0.75rem',
    marginBottom: '0.25rem',
    fontWeight: '600',
  },

  formInput: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },

  formButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },

  submitButton: {
    backgroundColor: '#357edd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },

  cancelButton: {
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },

  floatingButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    fontSize: '2rem',
    backgroundColor: '#f28b39',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    userSelect: 'none',
  },
};


export default LandingPage;
