import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/LandingPageStyles';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react'; // add this if not yet imported


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

  //maps
  const [currentPetCoords, setCurrentPetCoords] = useState(null);

  const mapRef = useRef();
  const MapFollower = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      if (coords) {
        map.setView([coords.lat, coords.lon], 14, {
          animate: true,
        });
      }
    }, [coords]);
    return null;
  };
  

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
    const geocodeAddress = async () => {
      if (!currentPet?.address) return;
  
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentPet.address)}`
        );
        const data = await response.json();
  
        if (data && data.length > 0) {
          setCurrentPetCoords({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setCurrentPetCoords(null);
      }
    };
  
    geocodeAddress();
  }, [currentPet]);
  
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
  const fetchPets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/all-pets');
      const data = await res.json();
      setPets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };
  
  useEffect(() => {
    fetchPets();
  }, []);
  
  

  const fetchProfilePicture = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile-picture', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileImage(response.data.image);
    } catch (error) {
      console.error('Error fetching profile image', error);
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
                          onClick={() =>
                            navigate(`/match-details/${notif.sender_id}`)
                          }
                          style={{
                            color: 'black',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
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
        <p style={styles.subtitle}>
          Connecting Pet Owners with Potential Blood Donors
        </p>
      </header>

      {currentPetCoords && (
  <div style={{ display: 'flex', width: '100%', margin: '20px 0' }}>
    {/* Map on the left */}
    <div style={{ flex: '1', height: '500px', marginRight: '20px', zIndex: 0 }}>
      <MapContainer
        center={[currentPetCoords.lat, currentPetCoords.lon]}
        zoom={14}
        scrollWheelZoom={false}
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
<Marker
  position={[currentPetCoords.lat, currentPetCoords.lon]}
  icon={L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      ">
        <!-- Circle head -->
        <div style="
          width: 40px;
          height: 40px;
          background: orange;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          z-index: 2;
        ">
          <div style="
            width: 30px;
            height: 30px;
            background: white;
            border-radius: 50%;
            overflow: hidden;
          ">
            <img 
              src="${currentPet?.images?.[0] || '/Images/default-pet.png'}" 
              alt="pet"
              style="width: 100%; height: 100%; object-fit: cover;" 
            />
          </div>
        </div>

        <!-- Pin tail -->
        <div style="
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 16px solid orange;
          margin-top: -2px;
          z-index: 1;
        "></div>
      </div>
    `,
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
  })}
>
  
  <Popup>
    <strong>${currentPet.name}</strong><br />
    ${currentPet.breed}<br />
    ${currentPet.address}
  </Popup>
</Marker>

        <MapFollower coords={currentPetCoords} />
      </MapContainer>
    </div>


    {/* Pet Card on the right */}
    <div style={{ flex: '1' }}>
      <div style={styles.cardNavigation}>
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
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Loading pets...
              </div>
            ) : activePets.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                No match found for "{searchQuery}"
              </div>
            ) : (
              <>
                <h2>{currentPet.name}</h2>
                <div style={styles.cardContent}>
                  <div style={styles.imageSection}>
                    {Array.isArray(currentPet.images) &&
                    currentPet.images.length > 0 ? (
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
                    <p>
                      <b>Breed:</b> {currentPet.breed}
                    </p>
                    <p>
                      <b>Blood Type:</b> {currentPet.blood_type}
                    </p>
                    <p>
                      <b>Age:</b> {currentPet.age}
                    </p>
                    <p>
                      <b>Sex:</b> {currentPet.sex}
                    </p>
                    <p>
                      <b>Weight (kgs):</b> {currentPet.kilos}
                    </p>
                    <p>
                      <b>Address:</b> {currentPet.address}
                    </p>
                    <p>
                      <b>Details:</b> {currentPet.details}
                    </p>
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
              currentPet.images.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '150px',
                    height: '150px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(2px)',
                  }}
                  onClick={() => {
                    if (idx === 1 && currentPet.images.length > 2) {
                      setShowAllImagesModal(true);
                    } else {
                      setFullscreenImage(img);
                    }
                  }}
                >
                  <img
                    src={img}
                    alt={`${currentPet.name} image ${idx + 1}`}
                    style={styles.largeImage}
                  />
                  {idx === 1 && currentPet.images.length > 2 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      +{currentPet.images.length - 2}
                    </div>
                  )}
                </div>
              ))
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
</div>
</div>
</div>
      )}

<div style={styles.buttonContainerRight}>
  <button onClick={handlePrev} style={styles.navButton}>Prev</button>
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


export default LandingPage;
