import React, { useState, useEffect } from 'react';

const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '20px',
  marginBottom: '20px',
  backgroundColor: '#fff',
  maxWidth: '400px',
  width: '100%',
};

const containerStyle = {
  maxWidth: '900px',
  margin: '40px auto',
  padding: '0 20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginRight: '10px',
};

const saveButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#4CAF50',
  color: 'white',
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#f44336',
  color: 'white',
};

const editButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#f28b39',
  color: 'white',
};

const PetDetailsPage = () => {
  const [pets, setPets] = useState([]);
  const [editPetId, setEditPetId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
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

  const handleEditClick = (pet) => {
    setEditPetId(pet.id);
    setEditFormData({
      name: pet.name,
      breed: pet.breed,
      bloodType: pet.bloodType,
      age: pet.age,
      sex: pet.sex,
      kilos: pet.kilos,
      address: pet.address,
      details: pet.details,
    });
  };

  const handleCancelClick = () => {
    setEditPetId(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async (petId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'PUT', // or PATCH depending on your API
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error('Failed to update pet');
      const updatedPet = await res.json();

      // Update pets in state
      setPets((prevPets) =>
        prevPets.map((pet) => (pet.id === petId ? updatedPet.pet : pet))
      );

      setEditPetId(null);
      setEditFormData({});
    } catch (err) {
      console.error(err);
      alert('Failed to save pet details');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Your Pets</h2>
      {pets.length === 0 && <p style={{ textAlign: 'center', color: '#777' }}>No pets found.</p>}
      {pets.map((pet) => (
        <div key={pet.id} style={cardStyle}>
          {editPetId === pet.id ? (
            <>
              <input
                style={inputStyle}
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <input
                style={inputStyle}
                type="text"
                name="breed"
                value={editFormData.breed}
                onChange={handleInputChange}
                placeholder="Breed"
              />
              <input
                style={inputStyle}
                type="text"
                name="bloodType"
                value={editFormData.bloodType}
                onChange={handleInputChange}
                placeholder="Blood Type"
              />
              <input
                style={inputStyle}
                type="number"
                name="age"
                value={editFormData.age}
                onChange={handleInputChange}
                placeholder="Age in months"
              />
              <input
                style={inputStyle}
                type="text"
                name="sex"
                value={editFormData.sex}
                onChange={handleInputChange}
                placeholder="Sex"
              />
              <input
                style={inputStyle}
                type="number"
                name="kilos"
                value={editFormData.kilos}
                onChange={handleInputChange}
                placeholder="Weight in kg"
              />
              <input
                style={inputStyle}
                type="text"
                name="address"
                value={editFormData.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
              <textarea
                style={{ ...inputStyle, height: '60px' }}
                name="details"
                value={editFormData.details}
                onChange={handleInputChange}
                placeholder="Details"
              />
              <div>
                <button
                  style={saveButtonStyle}
                  onClick={() => handleSaveClick(pet.id)}
                >
                  Save
                </button>
                <button style={cancelButtonStyle} onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ color: '#f28b39' }}>{pet.name}</h3>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Blood Type:</strong> {pet.bloodType}</p>
              <p><strong>Age:</strong> {pet.age} months</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Weight:</strong> {pet.kilos} kg</p>
              <p><strong>Address:</strong> {pet.address}</p>
              <p><strong>Details:</strong> {pet.details}</p>
              <button
                style={editButtonStyle}
                onClick={() => handleEditClick(pet)}
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PetDetailsPage;
