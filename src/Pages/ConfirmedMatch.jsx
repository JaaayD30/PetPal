import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConfirmedMatch = () => {
  const token = localStorage.getItem('token');
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchConfirmedMatch = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/confirmed-match', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOwner(data.owner);
        setPets(data.pets);
      } catch (err) {
        console.error('Error fetching confirmed match:', err);
      }
    };

    fetchConfirmedMatch();
  }, []);

  if (!owner) return <div>Loading confirmed match...</div>;

  return (
    <div style={{ display: 'flex', padding: 20, gap: 20, flexWrap: 'wrap' }}>
      <div style={{
        flex: '0 0 300px',
        background: '#f8f8f8',
        padding: 20,
        borderRadius: 12,
        textAlign: 'center'
      }}>
        <img
          src={owner.base64image ? `data:image/jpeg;base64,${owner.base64image}` : '/Images/default-user.png'}
          alt="Owner"
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }}
        />
        <h2>{owner.full_name}</h2>
        <p><strong>Email:</strong> {owner.email}</p>
        <p><strong>Address:</strong> {owner.address}</p>
        <p><strong>Phone:</strong> {owner.phone}</p>
      </div>

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 20
      }}>
        {pets.map(pet => (
          <div key={pet.id} style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ height: 150 }}>
              {pet.images.length > 0 ? (
                <img
                  src={pet.images[0]}
                  alt={pet.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888'
                }}>No image available</div>
              )}
            </div>
            <div style={{ padding: 12 }}>
              <h3>{pet.name}</h3>
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
    </div>
  );
};

export default ConfirmedMatch;
