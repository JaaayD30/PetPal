import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MatchDetailsPage = () => {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);

  const handleConfirmMatch = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/confirm-match',
        { senderId: userId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Match confirmed! Notification sent.');
    } catch (err) {
      if (err.response?.status === 400) {
        alert('You are already matched with this user.');
      } else {
        console.error('Error confirming match:', err);
      }
    }
  };
  

  const fetchMatchDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/match-details/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOwner(data.owner);
      setPets(data.pets);
    } catch (err) {
      console.error('Error fetching match details:', err);
    }
  };

  useEffect(() => {
    if (userId) fetchMatchDetails();
  }, [userId]);

  if (!owner) return <div>Loading match details...</div>;

  return (
    <div style={{
      background: '#f8f8f8',
      borderRadius: 16,
      padding: 30,
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      maxWidth: 1200,
      margin: '20px auto'
    }}>
      {/* Centered Owner Card */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
        <div style={{
          width: 300,
          background: '#f8f8f8',
          padding: 20,
          borderRadius: 12,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <img
            src={owner.base64image ? `data:image/jpeg;base64,${owner.base64image}` : '/Images/default-user.png'}
            alt="Owner"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 12
            }}
          />
          <h2>{owner.full_name}</h2>
          <p><strong>Email:</strong> {owner.email}</p>
          <p><strong>Address:</strong> {owner.address}</p>
          <p><strong>Phone:</strong> {owner.phone}</p>
  
          <button
            onClick={handleConfirmMatch}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Connect Back
          </button>
        </div>
      </div>
  
      {/* Container Card for Pets */}
      <div style={{
        background: '#f8f8f8',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {pets.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 20,
            background: '#f5f5f5',
            borderRadius: 12
          }}>
            No pets found for this owner.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
            justifyContent: 'start' // ensures left-alignment even with fewer than 4 cards
          }}>
            {pets.map(pet => (
              <div key={pet.id} style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', height: 150 }}>
                  {Array.isArray(pet.images) && pet.images.length > 0 ? (
                    <img
                      src={pet.images[0]}
                      alt={pet.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#888'
                    }}>
                      No image available
                    </div>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '8px 0' }}>{pet.name}</h3>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Blood Type:</strong> {pet.blood_type}</p>
                  <p><strong>Age:</strong> {pet.age} months</p>
                  <p><strong>Sex:</strong> {pet.sex}</p>
                  <p><strong>Weight:</strong> {pet.kilos} kg</p>
                  <p><strong>Address:</strong> {pet.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default MatchDetailsPage;
