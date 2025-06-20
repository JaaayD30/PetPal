import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const validFavorites = storedFavorites.filter(p => p && typeof p === 'object');
    if (validFavorites.length !== storedFavorites.length) {
      localStorage.setItem('favorites', JSON.stringify(validFavorites));
    }
    setFavoritePets(validFavorites);

    axios.get('http://localhost:5000/api/my-matches/details', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setConnectedUsers(res.data.map(match => match.id)))
    .catch(err => console.error('Failed to fetch match list:', err));
  }, []);

  const removeFromFavorites = (id) => {
    if (!window.confirm('Are you sure you want to remove this pet from favorites?')) return;
    const updated = favoritePets.filter(pet => pet.id !== id);
    setFavoritePets(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleConnect = async (petId, ownerId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/connect-request',
        { petId, recipientId: ownerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || 'Connect request sent!');
    } catch (error) {
      console.error(error);
      alert('Failed to send connect request.');
    }
  };

  const openImageModal = (images) => {
    setPreviewImages(images);
    setShowModal(true);
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Your Favorite Pets</h2>

      {favoritePets.length === 0 ? (
        <p style={styles.noFavorites}>You have no favorite pets yet.</p>
      ) : (
        <div style={styles.cardGrid}>
          {favoritePets.map((pet) => (
            <div key={pet.id} style={styles.card}>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: '#f28b39' }}>{pet.name}</h3>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Blood Type:</strong> {pet.blood_type || pet.bloodType}</p>
                <p><strong>Age:</strong> {pet.age} months</p>
                <p><strong>Sex:</strong> {pet.sex}</p>
                <p><strong>Weight:</strong> {pet.kilos} kg</p>
                <p><strong>Address:</strong> {pet.address}</p>
                <p><strong>Details:</strong> {pet.details}</p>

                {Array.isArray(pet.images) && pet.images.length > 0 && (
                  <div style={styles.imageSection}>
                    {/* First image */}
                    <img
                      src={pet.images[0]}
                      alt="Pet 1"
                      style={styles.largeImage}
                      onClick={() => openImageModal(pet.images)}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />

                    {/* Second image + overlay */}
                    {pet.images.length > 1 && (
                      <div
                        style={{ ...styles.largeImage, position: 'relative', cursor: 'pointer' }}
                        onClick={() => openImageModal(pet.images)}
                        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <img
                          src={pet.images[1]}
                          alt="Pet 2"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        {pet.images.length > 2 && (
                          <div style={styles.moreOverlay}>
                            +{pet.images.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={styles.buttonRow}>
                <button onClick={() => removeFromFavorites(pet.id)} style={styles.removeButton}>
                  Remove from Favorites
                </button>
                <button
                  style={{
                    ...styles.connectButton,
                    backgroundColor: connectedUsers.includes(pet.user_id) ? '#ccc' : '#4CAF50',
                    cursor: connectedUsers.includes(pet.user_id) ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => handleConnect(pet.id, pet.user_id)}
                  disabled={connectedUsers.includes(pet.user_id)}
                >
                  🐾 {connectedUsers.includes(pet.user_id) ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {previewImages.map((img, idx) => (
              <img key={idx} src={img} alt={`Preview ${idx + 1}`} style={styles.modalImage} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#333',
  },
  noFavorites: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '50px 70px',
    justifyContent: 'center',
    marginTop: '40px',
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    backgroundColor: '#fff',
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  imageSection: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  largeImage: {
    width: '140px',
    height: '140px',
    borderRadius: '8px',
    objectFit: 'cover',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  moreOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
  },
  buttonRow: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '10px',
  },
  removeButton: {
    padding: '5px 8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f44336',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
  },
  connectButton: {
    padding: '5px 8px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#fff',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '90%',
    maxHeight: '80%',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  modalImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
};

export default FavoritesPage;
