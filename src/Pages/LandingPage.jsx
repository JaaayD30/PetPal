import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    name: '',
    breed: '',
    bloodType: '',
    age: '',
    sex: '',
    address: '',
    kilos: '',
    details: '',
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pets');
        if (!res.ok) throw new Error('Failed to fetch pets');
        const data = await res.json();
        console.log('Fetched pets:', data.pets);  // <-- check here
        setPets(data.pets || []);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
  
    fetchPets();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('googleEmail');
    navigate('/');
    console.log('User logged out');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handlePets = () => {
    navigate('/pets');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result].slice(0, 5),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert('Failed to save pet: ' + errorData.message);
        return;
      }
  
      const data = await response.json();
      alert('Pet added successfully!');
      setPets((prev) => [...prev, data.pet]);
      console.log('Saved pet:', data.pet);
  
      setShowForm(false);
      setFormData({
        images: [],
        name: '',
        breed: '',
        bloodType: '',
        age: '',
        sex: '',
        address: '',
        kilos: '',
        details: '',
      });
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('An error occurred while saving the pet.');
    }
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>🐾 PetPal</div>
        <div style={styles.searchContainer}>
          <input type="text" placeholder="Search..." style={styles.searchInput} />
        </div>
        <div style={styles.profileSection}>
          <button onClick={toggleDropdown} style={styles.profileIcon}>👤</button>
          {dropdownOpen && (
            <div style={styles.dropdown}>
              <button onClick={handleProfile} style={styles.dropdownItem}>View Profile</button>
              <button onClick={handleLogout} style={styles.dropdownItem}>Log Out</button>
              <button onClick={handlePets} style={styles.dropdownItem}>Pets</button>
            </div>
          )}
        </div>
      </nav>

      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to PetPal</h1>
        <p style={styles.subtitle}>Connecting Pet Owners with Potential Blood Donors</p>
      </header>



      {/* POPUP FORM */}
      {showForm && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Pet Details</h2>
            <form onSubmit={handleFormSubmit}>
              <label style={styles.formLabel}>Upload Images (Max 5)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} style={styles.formInput} />

              <label style={styles.formLabel}>Pet Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.formInput} />
              
              <label style={styles.formLabel}>Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange} required style={styles.formInput} >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              
              <label style={styles.formLabel}>Breed</label>
              <select name="breed" value={formData.breed} onChange={handleChange} required style={styles.formInput} >
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
              <select name="bloodType" value={formData.bloodType} onChange={handleChange} required style={styles.formInput} >
                <option value="">Select Blood Type</option>
                <option value="DEA 1 Positive">DEA 1 Positive</option>
                <option value="DEA 1 Negative">DEA 1 Negative</option>
                <option value="DEA 3">DEA 3</option>
                <option value="DEA 4">DEA 4</option>
                <option value="DEA 5">DEA 5</option>
                <option value="DEA 7">DEA 7</option>
              </select>

              <label style={styles.formLabel}>Age (in months)</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required style={styles.formInput} />
              
              <label style={styles.formLabel}>Kilograms (Kg)</label>
              <input type="number" name="kilos" value={formData.kilos} onChange={handleChange} required style={styles.formInput} />
              
              <label style={styles.formLabel}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.formInput} />
              
              <label style={styles.formLabel}>Medical Details (Vaccinations, Vet visits, Health Condition)</label>
              <input type="text" name="details" value={formData.details} onChange={handleChange} required style={styles.formInput} />

              <div style={styles.formButtonGroup}>
                <button type="submit" style={styles.submitButton}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button onClick={() => setShowForm(true)} style={styles.fab}>＋</button>
    </div>
  );
};


const styles = {

  petList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    margin: '20px auto',
    width: '90%',
    maxWidth: '900px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  
  petCard: {
    border: '2px solid #5b9f85',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#e9f7f1',
  },
  
  petImagesContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    overflowX: 'auto',
  },
  
  petImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  
  petDetails: {
    lineHeight: '1.5',
    fontSize: '14px',
  },
  
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5b9f85',
    padding: '10px 20px',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    width: '60%',
    maxWidth: '400px',
    fontSize: '16px',
  },
  profileSection: {
    position: 'relative',
  },
  profileIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '40px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '5px',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '10px 15px',
    backgroundColor: '#fff',
    color: '#333',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
  },
  header: {
    textAlign: 'center',
    backgroundColor: '#5b9f85',
    padding: '30px',
    color: '#fff',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
  },
  cardSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: '40px',
    minHeight: '300px',
  },
  card: {
    backgroundColor: '#e9f7f1',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    minWidth: '300px',
    maxWidth: '400px',
    textAlign: 'center',
    margin: '0 20px',
  },
  arrowButton: {
    fontSize: '30px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  imageModal: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalImg: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '10px',
  },
  imageModalClose: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    fontSize: '32px',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  imageModalNavLeft: {
    position: 'absolute',
    left: '30px',
    fontSize: '40px',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  imageModalNavRight: {
    position: 'absolute',
    right: '30px',
    fontSize: '40px',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    width: '95%',
    maxWidth: '450px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '80vh', // Adjust this value based on your preferred max height
    overflowY: 'auto', // This will enable vertical scrolling if the content overflows
  },  
  formLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
  },
  formInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  formButtonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  submitButton: {
    backgroundColor: '#5b9f85',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  fab: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#5b9f85',
    color: '#fff',
    fontSize: '32px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default LandingPage;
