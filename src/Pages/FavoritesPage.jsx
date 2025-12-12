import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Styles/FavoritesPageStyles';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadFavoritePets = async () => {
      const storedFavoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];

      try {
        const res = await axios.get('http://localhost:5000/api/all-pets');
        const allPets = res.data;
        const matchedFavorites = allPets.filter(pet => storedFavoriteIds.includes(pet.id));
        setFavoritePets(matchedFavorites);
      } catch (error) {
        console.error('Failed to load favorite pets:', error);
      }

      try {
        const res = await axios.get('http://localhost:5000/api/my-matches/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnectedUsers(res.data.map(match => match.id));
      } catch (err) {
        console.error('Failed to fetch match list:', err);
      }
    };

    loadFavoritePets();
  }, []);

  const removeFromFavorites = (id) => {
    if (!window.confirm('Are you sure you want to remove this pet from favorites?')) return;
    const updated = favoritePets.filter(pet => pet.id !== id);
    setFavoritePets(updated);
    const updatedIds = updated.map(pet => pet.id);
    localStorage.setItem('favorites', JSON.stringify(updatedIds));
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
                    <img
                      src={pet.images[0]}
                      alt="Pet 1"
                      style={styles.largeImage}
                      onClick={() => openImageModal(pet.images)}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
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
                          <div style={styles.moreOverlay}>+{pet.images.length - 2} more</div>
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

export default FavoritesPage;
