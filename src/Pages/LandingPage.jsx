import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the stored data (for example, the user's email)
    localStorage.removeItem('googleEmail');
    // Optionally navigate to the login page or home
    navigate('/'); 
    console.log('User logged out');
  };

  const handleProfile = () => {
    // Navigate to the Profile page
    navigate('/profile');
  };

  return (
<<<<<<< HEAD
    <div style={styles.container}>
=======
    <div style={styles.pageContainer}>
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
              <button onClick={handlePets} style={styles.dropdownItem}>Pets</button>
              <button onClick={handleLogout} style={styles.dropdownItem}>Log Out</button>
            </div>
          )}
        </div>
      </nav>

      {/* HEADER */}
>>>>>>> 1bd26ddfc613bd6bc7be3676bbd2a63b30df674e
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to PetPal</h1>
        <p style={styles.subtitle}>Connecting Pet Owners with Potential Blood Donors</p>
      </header>

<<<<<<< HEAD
      <section style={styles.content}>
        <p style={styles.text}>
          PetPal is designed to help pet owners find blood donors for their pets in emergency situations.
          With just a few clicks, you can connect with willing donors nearby and ensure your pet receives
          the care it needs in times of crisis.
        </p>
        <button style={styles.button}>Get Started</button>
        {/* Profile Button */}
        <button onClick={handleProfile} style={styles.profileButton}>
          View Profile
        </button>
        {/* Log Out Button */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 PetPal. All rights reserved.</p>
      </footer>
=======
      {/* PET CARD + NAVIGATION */}
      <div style={styles.cardNavigation}>
  <button onClick={handlePrev} style={styles.navButton}>Prev</button>

  <div style={styles.card}>
    {loading ? (
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading pets...</div>
    ) : pets.length === 0 ? (
      <div style={{ padding: '2rem', textAlign: 'center' }}>No pets to display</div>
    ) : (
      <>
        <h2>{pets[currentIndex].name}</h2>
        <div style={styles.cardContent}>
          <div style={styles.imageSection}>
            {Array.isArray(pets[currentIndex].images) && pets[currentIndex].images.length > 0 ? (
              pets[currentIndex].images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${pets[currentIndex].name} image ${idx + 1}`}
                  style={styles.largeImage}
                  onClick={() => setSelectedImage(img)}
                  loading="lazy"
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div style={styles.detailsSection}>
            <p><b>Breed:</b> {pets[currentIndex].breed}</p>
            <p><b>Blood Type:</b> {pets[currentIndex].blood_type}</p>
            <p><b>Age:</b> {pets[currentIndex].age}</p>
            <p><b>Sex:</b> {pets[currentIndex].sex}</p>
            <p><b>Weight (kgs):</b> {pets[currentIndex].kilos}</p>
            <p><b>Address:</b> {pets[currentIndex].address}</p>
            <p><b>Details:</b> {pets[currentIndex].details}</p>
          </div>
        </div>
        {selectedImage && (
          <div style={styles.modal} onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Selected pet" style={styles.modalImage} />
          </div>
        )}
      </>
    )}
  </div>

  <button onClick={handleNext} style={styles.navButton}>Next</button>
</div>


      {/* POPUP FORM */}
      {showForm && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Pet Details</h2>
            <form onSubmit={handleFormSubmit}>
              <label style={styles.formLabel}>Upload Images (Max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Pet Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                style={styles.formInput}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label style={styles.formLabel}>Breed</label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                style={styles.formInput}
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
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                style={styles.formInput}
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

              <label style={styles.formLabel}>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Weight (Kilos)</label>
              <input
                type="number"
                name="kilos"
                value={formData.kilos}
                onChange={handleChange}
                required
                min="0"
                style={styles.formInput}
              />

              <label style={styles.formLabel}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ ...styles.formInput, height: '60px' }}
              />

              <label style={styles.formLabel}>Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                style={{ ...styles.formInput, height: '60px' }}
              />

              <div style={styles.formButtons}>
                <button type="submit" style={styles.submitButton}>Save Pet</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        style={styles.floatingButton}
        title="Add Pet"
      >
        +
      </button>
>>>>>>> 1bd26ddfc613bd6bc7be3676bbd2a63b30df674e
    </div>
  );
};

const styles = {
<<<<<<< HEAD
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
=======
  navbar: {
    backgroundColor: '#f28b39',
    display: 'flex',
    justifyContent: 'center',  // Center all children horizontally
    padding: '0.75rem 1rem',
    color: 'white',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginRight: 'auto', // Push logo to the left
  },

  searchContainer: {
    width: '300px',       // Fixed width to make it shorter
    margin: '0 auto',    // Center the container itself
  },

  searchInput: {
    width: '100%',      // Fill the container width
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    border: 'none',
    fontSize: '1rem',
  },

  profileSection: {
    position: 'relative',
    marginLeft: 'auto', // Push profile section to the right
  },

  profileIcon: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },


  dropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    backgroundColor: 'white',
>>>>>>> 1bd26ddfc613bd6bc7be3676bbd2a63b30df674e
    color: '#333',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#5b9f85',
    padding: '20px',
    color: '#fff',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '20px',
  },
<<<<<<< HEAD
  content: {
    padding: '30px',
    backgroundColor: '#fff',
    flex: 1,
=======

  cardNavigation: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },

  
cardContent: {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'flex-start',
},

imageSection: {
  flex: '1 1 40%',
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
  flex: '1 1 60%',
  fontSize: '1.1rem',
  color: '#333',
  lineHeight: '1.4',
},

  navButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#f28b39',
    color: 'white',
    cursor: 'pointer',
    userSelect: 'none',
  },

  card: {
    backgroundColor: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 1rem',
>>>>>>> 1bd26ddfc613bd6bc7be3676bbd2a63b30df674e
  },
  text: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#5b9f85',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  profileButton: {
    backgroundColor: '#3498db', // Blue color for Profile
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  logoutButton: {
    backgroundColor: '#e74c3c', // Red color for logout
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
<<<<<<< HEAD
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
  },
  footerText: {
    margin: 0,
=======

  floatingButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    fontSize: '2rem',
    backgroundColor: '#f28b39',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    userSelect: 'none',
>>>>>>> 1bd26ddfc613bd6bc7be3676bbd2a63b30df674e
  },
};

export default LandingPage;
