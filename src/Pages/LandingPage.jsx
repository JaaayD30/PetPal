import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPets, setFilteredPets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAllImagesModal, setShowAllImagesModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [expandedPetIndex, setExpandedPetIndex] = useState(null);

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

  // Navigation Handlers
  const handleProfile = () => navigate('/profile');
  const handleFavorites = () => navigate('/favorites');
  const handlePets = () => navigate('/pets');
  const handleConnected = () => navigate('/connectedmatches');
  const handleLogout = () => {
    localStorage.removeItem('googleEmail');
    localStorage.removeItem('token');
    navigate('/');
    console.log('User logged out');
  };

  // Toggle
  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleExpandPet = (index) => {
    setExpandedPetIndex(prev => (prev === index ? null : index));
  };

  // Derived Data
  const activePets = filteredPets.length > 0 ? filteredPets : pets;
  const currentPet = activePets[currentIndex];

  // Effects
  useEffect(() => {
    fetchPets();
    fetchProfilePicture();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (token) {
      const base64Url = token.split('.')[1];
      const decodedValue = JSON.parse(atob(base64Url));
      setCurrentUserId(decodedValue.id);
    }
  }, []);

  // Fetchers
  const fetchPets = () => {
    setLoading(true);
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
  };

  const fetchProfilePicture = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/profile-picture', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.image) {
        setProfileImage(res.data.image);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Notification Handlers
  const clearNotification = async (notifId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notifId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
    }
  };

  // Search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPets([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = pets.filter(pet =>
      (pet.breed && pet.breed.toLowerCase().includes(query)) ||
      (pet.blood_type && pet.blood_type.toLowerCase().includes(query)) ||
      (pet.age && pet.age.toString().includes(query)) ||
      (pet.address && pet.address.toLowerCase().includes(query))
    );

    setFilteredPets(results);
    setCurrentIndex(0);
  };

  // Pet Navigation
  const handlePrev = () => {
    const list = filteredPets.length > 0 ? filteredPets : pets;
    setCurrentIndex(prev => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    const list = filteredPets.length > 0 ? filteredPets : pets;
    setCurrentIndex(prev => (prev === list.length - 1 ? 0 : prev + 1));
  };

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
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
      fetchPets();
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

  const handleFavorite = (pet) => {
    const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const alreadyFavorited = existingFavorites.some(fav => fav.id === pet.id);

    if (alreadyFavorited) {
      alert(`${pet.name} is already in favorites.`);
      return;
    }

    const updatedFavorites = [...existingFavorites, pet];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    alert(`${pet.name} added to favorites!`);
  };

  const handleConnect = async (petId, ownerId) => {
    if (ownerId === currentUserId) {
      alert("You cannot connect to your own pet.");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/connect-request',
        { petId, recipientId: ownerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || 'Connect request sent!');
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert('Failed to send connect request.');
      }
    }
  };
  

  return (
    <div style={styles.pageContainer}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
  <div style={styles.logo}>🐾 PetPal</div>

  <div style={styles.searchContainer}>
    <input
      type="text"
      placeholder="Search by breed, blood type, age, address..."
      style={styles.searchInput}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      }}
    />
  </div>

  <div style={styles.navRight}>
    {/* 🔔 Notification Bell and Dropdown */}
    <div style={{ position: 'relative', marginRight: '10px' }}>
      <div
        style={styles.notificationIcon}
        title="Notifications"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {notifications.length > 0 && (
          <span style={styles.notificationDot}></span>
        )}
      </div>

      {showNotifications && (
        <div style={styles.notificationDropdown}>
          {notifications.length === 0 ? (
            <p style={styles.notificationItem}>No new notifications</p>
          ) : (
            <>
              <div style={styles.dropdownHeader}>
                <strong>Notifications</strong>
                <button
                  onClick={clearAllNotifications}
                  style={styles.clearAllButton}
                >
                  ✖
                </button>
              </div>
              {notifications.map((notif) => (
  <div key={notif.id} style={styles.notificationItem}>
    <span
      onClick={() => navigate(`/match-details/${notif.sender_id}`)} // 👈 Use sender_id or relevant userId
      style={{ color: 'black', cursor: 'pointer', textDecoration: 'underline' }}
    >
      🐾 {notif.message}
    </span>
    <button
      onClick={() => clearNotification(notif.id)}
      style={styles.clearOneButton}
    >
      ❌
    </button>
  </div>
))}
            </>
          )}
        </div>
      )}
    </div>

    {/* 👤 Profile Image and Dropdown */}
    <div style={{ position: 'relative' }}>
      <img
        src={profileImage || '/Images/default-user.png'}
        alt="Profile"
        onClick={toggleDropdown}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          objectFit: 'cover',
          border: '2px solid #FA9A51',
        }}
      />
      {dropdownOpen && (
        <div style={styles.dropdown}>
          <button onClick={handleProfile} style={styles.dropdownItem}>
            View Profile
          </button>
          <button onClick={handlePets} style={styles.dropdownItem}>
            Pets
          </button>
          <button onClick={handleFavorites} style={styles.dropdownItem}>
            Favorites
          </button>
          <button onClick={handleConnected} style={styles.dropdownItem}>
            Matched
          </button>
          <button onClick={handleLogout} style={styles.dropdownItem}>
            Log Out
          </button>
        </div>
      )}
    </div>
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
      ) : activePets.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          No match found for "{searchQuery}"
        </div>
      ) : (
        <>
          <h2>{currentPet.name}</h2>
          <div style={styles.cardContent}>
            <div style={styles.imageSection}>
            {Array.isArray(currentPet.images) && currentPet.images.length > 0 ? (
  <>
    {currentPet.images.slice(0, 2).map((img, idx) => (
      <img
        key={idx}
        src={img}
        alt={`${currentPet.name} image ${idx + 1}`}
        style={styles.largeImage}
        onClick={() => {
          if (expandedPetIndex === currentIndex) {
            setFullscreenImage(img);
          }
        }}
      />
    ))}
     {currentPet.images.length > 2 && (
      <div
        style={styles.imageOverlay}
        onClick={() => {
          if (expandedPetIndex === currentIndex) {
            setShowAllImagesModal(true);
          } else {
            toggleExpandPet(currentIndex);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (expandedPetIndex === currentIndex) {
              setShowAllImagesModal(true);
            } else {
              toggleExpandPet(currentIndex);
            }
          }
        }}
      >
        +{currentPet.images.length - 2} more
      </div>
    )}
  </>
) : (
  <p>No images available</p>
)}

              {fullscreenImage && (
                <div
                  style={styles.fullscreenOverlay}
                  onClick={() => setFullscreenImage(null)}
                  role="dialog"
                  aria-modal="true"
                >
                  <img
                    src={fullscreenImage}
                    alt="Fullscreen pet"
                    style={styles.fullscreenImage}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => setFullscreenImage(null)}
                    style={styles.fullscreenCloseButton}
                    aria-label="Close fullscreen image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div style={styles.detailsSection}>
              <p><b>Breed:</b> {currentPet.breed}</p>
              <p><b>Blood Type:</b> {currentPet.blood_type}</p>
              <p><b>Age:</b> {currentPet.age}</p>
              <p><b>Sex:</b> {currentPet.sex}</p>
              <p><b>Weight (kgs):</b> {currentPet.kilos}</p>
              <p><b>Address:</b> {currentPet.address}</p>
              <p><b>Details:</b> {currentPet.details}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )}

  {/* Expanded modal */}
  {expandedPetIndex === currentIndex && activePets.length > 0 && (
    <div
      style={styles.modalOverlay}
      onClick={() => {
        if (!fullscreenImage) {
          toggleExpandPet(null);
        } else {
          setFullscreenImage(null);
        }
      }}
    >
      <div
        style={{ ...styles.card, ...styles.cardExpanded }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        <button
          style={styles.heartButton}
          onClick={() => handleFavorite(currentPet)}
          aria-label="Heart pet"
        >
          ❤️
        </button>

        <button
  style={styles.connectButton}
  onClick={() => handleConnect(currentPet.id, currentPet.user_id)}
  aria-label="Connect pet"
>
  🐾 Connect
</button>


        <>
          <h2>{currentPet.name}</h2>
          <div style={styles.cardContent}>
            <div style={styles.imageSection}>
            {Array.isArray(currentPet.images) && currentPet.images.length > 0 ? (
  <>
    {currentPet.images.slice(0, 2).map((img, idx) => (
      <img
        key={idx}
        src={img}
        alt={`${currentPet.name} image ${idx + 1}`}
        style={styles.largeImage}
        onClick={() => setFullscreenImage(img)}
      />
    ))}

    {currentPet.images.length > 2 && (
      <div
        style={styles.imageOverlay}
        onClick={(e) => {
          e.stopPropagation();
          setShowAllImagesModal(true);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setShowAllImagesModal(true);
        }}
      >
        +{currentPet.images.length - 2} more
      </div>
    )}
  </>
) : (
  <p>No images available</p>
)}



              {fullscreenImage && (
                <div
                  style={styles.fullscreenOverlay}
                  onClick={() => setFullscreenImage(null)}
                  role="dialog"
                  aria-modal="true"
                >
                  <img
                    src={fullscreenImage}
                    alt="Fullscreen pet"
                    style={styles.fullscreenImage}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => setFullscreenImage(null)}
                    style={styles.fullscreenCloseButton}
                    aria-label="Close fullscreen image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div style={styles.detailsSection}>
              <p><b>Breed:</b> {currentPet.breed}</p>
              <p><b>Blood Type:</b> {currentPet.blood_type}</p>
              <p><b>Age:</b> {currentPet.age}</p>
              <p><b>Sex:</b> {currentPet.sex}</p>
              <p><b>Weight (kgs):</b> {currentPet.kilos}</p>
              <p><b>Address:</b> {currentPet.address}</p>
              <p><b>Details:</b> {currentPet.details}</p>
            </div>
          </div>
        </>
      </div>
    </div>
  )}

  <button onClick={handleNext} style={styles.navButton}>Next</button>
</div>

{showAllImagesModal && (
  <div
    style={styles.fullscreenOverlay}
    onClick={() => setShowAllImagesModal(false)}
  >
    <div
      style={styles.allImagesModal}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 style={{ textAlign: 'center' }}>{currentPet.name} — All Images</h3>
      <div style={styles.allImagesGrid}>
        {currentPet.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Image ${idx + 1}`}
            style={styles.fullImageThumbnail}
          />
        ))}
      </div>
      <button
        onClick={() => setShowAllImagesModal(false)}
        style={styles.fullscreenCloseButton}
      >
        × Close
      </button>
    </div>
  </div>
)}


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

              <label style={styles.formLabel}>Age(in months)</label>
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
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  
  notificationDropdown: {
    position: 'absolute',
    top: '120%', // below the bell
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: '250px',
    zIndex: 999,
    padding: '10px',
  },
  
  notificationItem: {
    fontSize: '14px',
    color: 'black',
    padding: '5px 0',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
  },
  
  clearAllButton: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '12px',
    cursor: 'pointer',
  },
  
  clearOneButton: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '12px',
    cursor: 'pointer',
  },
  
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontWeight: 'bold',
  },  
  

  fullscreenOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1500,
    cursor: 'pointer',
  },

  fullscreenImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    cursor: 'default',
  },

  fullscreenCloseButton: {
    position: 'fixed',
    top: '20px',
    right: '30px',
    fontSize: '2rem',
    color: 'white',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 1600,
  },

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
    position: 'relative',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    height: '65vh',
    maxHeight: '90vh',
  },

  // Modal overlay for expanded pet card
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  allImagesModal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '80vw',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  
  allImagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
    marginTop: '10px',
  },
  
  fullImageThumbnail: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '8px',
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

  heartButton: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
  },
  
  connectButton: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#FA9A51',
    color: '#fff',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
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
