import React, { useState, useEffect } from 'react';

const PetDetailsPage = () => {
  const [pets, setPets] = useState([]);
  const [editPetId, setEditPetId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null); // For modal image source

  const token = localStorage.getItem('token');

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch pets');
      const data = await res.json();
      setPets(data);
    } catch (err) {
      setError(err.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [token]);

  const handleEditClick = (pet) => {
    setEditPetId(pet.id);
    setEditFormData({
      name: pet.name || '',
      breed: pet.breed || '',
      bloodType: pet.blood_type || '',
      age: pet.age || '',
      sex: pet.sex || '',
      kilos: pet.kilos || '',
      address: pet.address || '',
      details: pet.details || '',
    });
  };

  const handleCancelClick = () => {
    setEditPetId(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (petId) => {
    const requiredFields = ['name', 'breed', 'bloodType', 'age', 'sex', 'address', 'kilos', 'details'];
    for (const field of requiredFields) {
      if (!editFormData[field]) {
        alert(`Field "${field}" is required.`);
        return;
      }
    }

    try {
      const res = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update pet');
      }

      const updatedPetData = await res.json();
      setPets((prevPets) =>
        prevPets.map((pet) => (pet.id === petId ? updatedPetData.pet : pet))
      );
      setEditPetId(null);
      setEditFormData({});
      alert('Pet updated successfully');
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const handleDeleteClick = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete pet');
      }

      setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
      alert('Pet deleted successfully');
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  // Modal close handler
  const closeModal = () => setModalImage(null);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading pets...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Your Pets</h2>
      {Array.isArray(pets) && pets.length === 0 && (
        <p style={{ textAlign: 'center', color: '#777' }}>No pets found.</p>
      )}
      {pets.map((pet) => (
        <div key={pet.id} style={cardStyle}>
          {editPetId === pet.id ? (
            <>
              {/* Edit inputs */}
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
              <p><strong>Blood Type:</strong> {pet.blood_type}</p>
              <p><strong>Age:</strong> {pet.age} months</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Weight:</strong> {pet.kilos} kg</p>
              <p><strong>Address:</strong> {pet.address}</p>
              <p><strong>Details:</strong> {pet.details}</p>

              {/* Clickable thumbnails */}
              {pet.images && pet.images.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {pet.images.map((imgSrc, idx) => (
                    <img
                      key={idx}
                      src={imgSrc}
                      alt={`Pet Image ${idx + 1}`}
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                      }}
                      onClick={() => setModalImage(imgSrc)}
                      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ))}
                </div>
              )}

              <button
                style={editButtonStyle}
                onClick={() => handleEditClick(pet)}
              >
                Edit
              </button>
              <button
                style={{ ...cancelButtonStyle, marginLeft: '10px' }}
                onClick={() => handleDeleteClick(pet.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}

      {/* Modal for image viewing */}
      {modalImage && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
        >
          <img
            src={modalImage}
            alt="Enlarged pet"
            style={{
              maxHeight: '90%',
              maxWidth: '90%',
              borderRadius: '12px',
              boxShadow: '0 0 15px #fff',
              cursor: 'auto',
            }}
            onClick={e => e.stopPropagation()} // Prevent modal close on image click
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

const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '20px',
  backgroundColor: '#fff',
  maxWidth: '400px',
  width: '100%',
  flex: '0 0 400px',  // fix card width inside flex container
};


const containerStyle = {
  maxWidth: '900px',
  margin: '40px auto',  // centers container horizontally with vertical spacing
  padding: '20px',      // add some padding inside the container
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  // centers children horizontally
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

export default PetDetailsPage;
