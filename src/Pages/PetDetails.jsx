import React, { useState, useEffect } from 'react';

const PetDetailsPage = () => {
  const [pets, setPets] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch pets');
        const data = await res.json();
        setPets(data.pets);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPets();
  }, [token]);

  return (
    <div>
      <h2>Your Pets</h2>
      {pets.length === 0 && <p>No pets found.</p>}
      {pets.map((pet) => (
        <div key={pet.id} style={{border: '1px solid #ccc', padding: '15px', marginBottom: '10px'}}>
          <h3>{pet.name}</h3>
          <p>Breed: {pet.breed}</p>
          <p>Blood Type: {pet.bloodType}</p>
          <p>Age: {pet.age} months</p>
          <p>Sex: {pet.sex}</p>
          <p>Weight: {pet.kilos} kg</p>
          <p>Address: {pet.address}</p>
          <p>Details: {pet.details}</p>
          {/* You can add images display here too if you saved images */}
        </div>
      ))}
    </div>
  );
};

export default PetDetailsPage;
