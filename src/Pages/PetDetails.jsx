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
      images: pet.images || '',
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

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
  
    // Prevent more than 5 total images
    const total = editFormData.images.length + files.length;
    const remaining = 5 - editFormData.images.length;
    const filesToAdd = files.slice(0, remaining);
  
    setEditFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToAdd],
    }));
  };
  
  const handleRemoveEditImage = (indexToRemove) => {
    setEditFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
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
      <h2 style={headerStyle}>Your Companions</h2>
      {Array.isArray(pets) && pets.length === 0 && (
        <p style={{ textAlign: 'center', color: '#777' }}>No pets found.</p>
      )}
       <div style={gridStyle}>
      {pets.map((pet) => (
        <div key={pet.id} style={cardStyle}>
          {editPetId === pet.id ? (
 <>
{/* Edit Image Section */}
<label style={styles.formLabel}>Upload Images (Max 5)</label>

{/* Upload Button */}
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleEditImageChange}
  style={styles.formInput}
  disabled={editFormData.images.length >= 5}
/>

{/* Preview of current + uploaded images */}
<div style={styles.imagePreviewContainer}>
  {editFormData.images.map((img, index) => (
    <div key={index} style={styles.imageWrapper}>
      <img
        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
        alt={`pet-${index}`}
        style={styles.previewImage}
      />
      <button
        type="button"
        onClick={() => handleRemoveEditImage(index)}
        style={styles.removeImageButton}
        title="Remove image"
      >
        ✕
      </button>
    </div>
  ))}
 </div>
  <label style={styles.formLabel}>Pet Name</label>
  <input
    style={styles.formInput}
    type="text"
    name="name"
    value={editFormData.name}
    onChange={handleInputChange}
    placeholder="Name"
  />

  <label style={styles.formLabel}>Sex</label>
  <select
    style={styles.formInput}
    name="sex"
    value={editFormData.sex}
    onChange={handleInputChange}
    required
  >
    <option value="">Select Sex</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>

  <label style={styles.formLabel}>Breed</label>
  <select
    style={styles.formInput}
    name="breed"
    value={editFormData.breed}
    onChange={handleInputChange}
    required
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
    style={styles.formInput}
    name="bloodType"
    value={editFormData.bloodType}
    onChange={handleInputChange}
    required
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

  <label style={styles.formLabel}>Age (in months)</label>
  <input
    style={styles.formInput}
    type="number"
    name="age"
    value={editFormData.age}
    onChange={handleInputChange}
    placeholder="Age in months"
    min="0"
  />

  <label style={styles.formLabel}>Weight (Kilos)</label>
  <input
    style={styles.formInput}
    type="number"
    name="kilos"
    value={editFormData.kilos}
    onChange={handleInputChange}
    placeholder="Weight in kg"
    min="0"
  />

  <label style={styles.formLabel}>Address</label>
  <textarea
    style={{ ...styles.formInput, height: '60px' }}
    name="address"
    value={editFormData.address}
    onChange={handleInputChange}
    placeholder="Address"
    required
  />

  <label style={styles.formLabel}>Details</label>
  <textarea
    style={{ ...styles.formInput, height: '60px' }}
    name="details"
    value={editFormData.details}
    onChange={handleInputChange}
    placeholder="Details"
  />

  <div style={styles.formButtons}>
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
    </div>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 280px)', // 4 cards per row
  gap: '50px 70px', // 40px row gap, 32px column gap
  justifyContent: 'center',
  marginTop: '40px',
};




const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  backgroundColor: '#fff',
  width: '280px',
  flex: '0 0 auto',
};


const styles = {
  formLabel: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    marginTop: '10px',
  },
  formInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  imagePreviewContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px',
  },
  imageWrapper: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  removeImageButton: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center',
  },
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
  fontSize: '35px',
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
