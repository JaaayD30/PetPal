import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const validFavorites = storedFavorites.filter(p => p && typeof p === 'object');
    if (validFavorites.length !== storedFavorites.length) {
      localStorage.setItem('favorites', JSON.stringify(validFavorites));
    }
    setFavoritePets(validFavorites);
  }, []);

  const removeFromFavorites = (id) => {
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

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Your Favorite Pets</h2>

      {favoritePets.length === 0 ? (
        <p style={styles.noFavorites}>You have no favorite pets yet.</p>
      ) : (
        <div style={styles.cardGrid}>
          {favoritePets.map((pet) => (
            <div
  key={pet.id}
  style={{
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    backgroundColor: '#fff',
    width: '280px',
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // ensure card fills height
  }}
>
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
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        {pet.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Pet ${idx + 1}`}
            style={{
              maxWidth: '150px',
              maxHeight: '150px',
              borderRadius: '8px',
              objectFit: 'cover',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ))}
      </div>
    )}
  </div>

  {/* Buttons pushed to bottom */}
  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
    <button
      onClick={() => removeFromFavorites(pet.id)}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#f44336',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      Remove from Favorites
    </button>
    <button
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      onClick={() => handleConnect(pet.id, pet.user_id)}
    >
      🐾 Connect
    </button>
  </div>
</div>

          ))}
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
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  imageSection: {
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
    marginTop: '10px',
  },
  buttonRow: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '10px',
  },
  removeButton: {
    background: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  connectButton: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default FavoritesPage;
