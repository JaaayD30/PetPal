import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MatchDetailsPage = () => {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const closeModal = () => setModalImage(null);


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
    <div>
      {/* Owner Card */}
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

      {/* Pet Cards */}
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
            justifyContent: 'start'
          }}>
            {pets.map(pet => (
              <div key={pet.id} style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ color: '#f28b39', marginBottom: 10 }}>{pet.name}</h3>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Blood Type:</strong> {pet.blood_type || pet.bloodType}</p>
                <p><strong>Age:</strong> {pet.age} months</p>
                <p><strong>Sex:</strong> {pet.sex}</p>
                <p><strong>Weight:</strong> {pet.kilos} kg</p>
                <p><strong>Address:</strong> {pet.address}</p>
                <p><strong>Details:</strong> {pet.details}</p>

                {Array.isArray(pet.images) && pet.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    {/* First image */}
                    <img
                      src={pet.images[0]}
                      alt="Pet 1"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                      }}
                      onClick={() => setModalImage(pet.images[0])} // first image
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />

                    {/* Second image + overlay */}
                    {pet.images.length > 1 && (
                      <div
                        style={{
                          width: '100px',
                          height: '100px',
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: 8,
                          overflow: 'hidden',
                          transition: 'transform 0.2s',
                        }}
                        onClick={() => setModalImage(pet.images[1])} // second image
                        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <img
                          src={pet.images[1]}
                          alt="Pet 2"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {pet.images.length > 2 && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: '#fff',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8
                          }}>
                            +{pet.images.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modalImage && (
  <div
    onClick={closeModal}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      cursor: 'pointer',
    }}
  >
    <img
      src={modalImage}
      alt="Pet Enlarged"
      style={{
        maxHeight: '90%',
        maxWidth: '90%',
        borderRadius: '12px',
        boxShadow: '0 0 15px #fff',
        cursor: 'auto',
      }}
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
    />
    <button
      onClick={closeModal}
      style={{
        position: 'fixed',
        top: 20,
        right: 30,
        background: 'transparent',
        border: 'none',
        fontSize: '2rem',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
      aria-label="Close image"
    >
      &times;
    </button>
  </div>
)}

    </div>
  );
};

export default MatchDetailsPage;
