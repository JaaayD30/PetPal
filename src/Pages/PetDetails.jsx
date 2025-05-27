import React, { useEffect, useState } from 'react';

const styles = {
  petList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  },
  petCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '300px',
    padding: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  petImagesContainer: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    marginBottom: '15px',
    maxHeight: '150px',
  },
  petImage: {
    height: '120px',
    width: 'auto',
    borderRadius: '5px',
    objectFit: 'cover',
  },
  petDetails: {
    textAlign: 'left',
    width: '100%',
    marginBottom: '15px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
};

const PetDetailsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pets with images in base64 from backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pets');
        if (!res.ok) throw new Error('Failed to fetch pets');
        const data = await res.json();

        // Assuming backend returns pets with images as raw buffers, we convert images to base64 strings here
        // If backend already returns base64 strings in pet.images, you can skip this step
        const petsWithImages = await Promise.all(
          data.pets.map(async (pet) => {
            // Fetch pet images separately (if needed)
            // If your backend includes images with pet data, skip this step
            // Example assuming backend returns images as buffers:
            // You should have an API endpoint to get pet images as base64 for each pet id
            // For now, let's assume pet.images is an array of base64 strings directly
            return {
              ...pet,
              images: pet.images || [], // Adjust if needed
            };
          })
        );

        setPets(petsWithImages);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Edit handler (open a modal or redirect to edit page)
  const handleEditPet = (pet) => {
    alert(`Edit pet: ${pet.name} (ID: ${pet.id}) - implement your edit logic here`);
  };

  // Delete handler
  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Are you sure you want to delete pet: ${pet.name}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/pets/${pet.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPets((prev) => prev.filter((p) => p.id !== pet.id));
      } else {
        alert('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Error deleting pet');
    }
  };

  if (loading) {
    return <p>Loading pets...</p>;
  }

  return (
    <div style={styles.petList}>
      {pets.length === 0 ? (
        <p>No pets available.</p>
      ) : (
        pets.map((pet, index) => (
          <div key={pet.id} style={styles.petCard}>
            <h3 style={{ marginBottom: '10px' }}>PET {index + 1}</h3>

            <div style={styles.petImagesContainer}>
              {pet.images && pet.images.length > 0 ? (
                pet.images.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`Pet ${index + 1} Image ${idx + 1}`}
                    style={styles.petImage}
                  />
                ))
              ) : (
                <p>No Images</p>
              )}
            </div>

            <div style={styles.petDetails}>
              <p><strong>Name:</strong> {pet.name}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Blood Type:</strong> {pet.blood_type}</p>
              <p><strong>Age:</strong> {pet.age} months</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Weight:</strong> {pet.kilos} Kg</p>
              <p><strong>Address:</strong> {pet.address}</p>
              <p><strong>Medical Details:</strong> {pet.details}</p>
            </div>

            <div style={styles.buttonContainer}>
              <button
                style={{ ...styles.button, ...styles.editButton }}
                onClick={() => handleEditPet(pet)}
              >
                Edit
              </button>

              <button
                style={{ ...styles.button, ...styles.deleteButton }}
                onClick={() => handleDeletePet(pet)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PetDetailsPage;
