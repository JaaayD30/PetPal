import React, { useState } from 'react';

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem',
    paddingTop: '15rem',
    fontFamily: 'Arial, sans-serif',
  },

  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '120px',
    backgroundColor: '#FFA500',
    color: '#fff',
    display: 'grid',
    gridTemplateColumns: '120px 1fr 120px',
    alignItems: 'center',
    padding: '0 1rem',
    boxSizing: 'border-box',
    zIndex: 999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  logo: {
    height: '70px',
    objectFit: 'contain',
    maxWidth: '100px',
  },

  fixedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    gap: '2%',
  },

  fixedBox: {
    width: '49%',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    minHeight: '200px',
  },

  section: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },

  boxTitle: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#D84C4C',
  },

  paragraph: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: 1.6,
  },

  steps: {
    paddingLeft: '1.2rem',
    marginTop: '0.5rem',
    lineHeight: 1.7,
  },

  imagePlaceholder: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#aaa',
    fontStyle: 'italic',
  },
};

const DetailsPage = () => {
  const [hoveredBox, setHoveredBox] = useState(null);

  const getHoverStyle = (index, baseStyle) => ({
    ...baseStyle,
    transition: 'all 0.3s ease',
    transform: hoveredBox === index ? 'scale(1.08)' : 'scale(1)',
    boxShadow:
      hoveredBox === index
        ? '0 8px 18px rgba(0, 0, 0, 0.15)'
        : baseStyle.boxShadow,
    cursor: 'pointer',
  });

  return (
    <>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/Images/Logo.png" alt="Left Logo" style={styles.logo} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Welcome to PetPal</h1>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Saving lives...</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/Images/Logo.png" alt="Right Logo" style={styles.logo} />
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.fixedRow}>
          <div
            style={getHoverStyle(0, styles.fixedBox)}
            onMouseEnter={() => setHoveredBox(0)}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#FFECE3',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.8rem',
                color: '#D84C4C',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}>
                🐾
              </div>
              <h2 style={{ ...styles.boxTitle, marginBottom: 0 }}>What is PetPal?</h2>
            </div>
            <p style={{ ...styles.paragraph, fontSize: '1.05rem', color: '#444' }}>
              <strong>PetPal</strong> is a platform designed to <span style={{ color: '#D84C4C', fontWeight: 'bold' }}>save pet lives</span> by
              connecting pet owners with compassionate donors nearby...
            </p>
          </div>

          <div
            style={getHoverStyle(1, styles.fixedBox)}
            onMouseEnter={() => setHoveredBox(1)}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <h2 style={styles.boxTitle}>📱 How to Use PetPal</h2>
            <ul style={styles.steps}>
              <li>1. Create an account and add your pet's info.</li>
              <li>2. Request blood with type and location.</li>
              <li>3. Nearby donors are notified.</li>
              <li>4. Chat securely & meet at a vet.</li>
            </ul>
          </div>
        </div>

        <div
          style={getHoverStyle(2, styles.section)}
          onMouseEnter={() => setHoveredBox(2)}
          onMouseLeave={() => setHoveredBox(null)}
        >
          <h2 style={styles.boxTitle}>📍 How to Connect With Donors</h2>
          <p style={styles.paragraph}>
            PetPal uses geolocation to find compatible donors near you. Once matched, you can chat
            and arrange a vet visit.
          </p>
        </div>

        <div
          style={getHoverStyle(3, styles.section)}
          onMouseEnter={() => setHoveredBox(3)}
          onMouseLeave={() => setHoveredBox(null)}
        >
          <h2 style={styles.boxTitle}>🔍 App Screens Preview</h2>
          <div style={styles.imagePlaceholder}>[You can embed screenshots or a demo video here]</div>
        </div>

        <div
          style={getHoverStyle(4, styles.section)}
          onMouseEnter={() => setHoveredBox(4)}
          onMouseLeave={() => setHoveredBox(null)}
        >
          <h2 style={styles.boxTitle}>🚀 Ready to Help or Get Help?</h2>
          <p style={styles.paragraph}>
            Join the community of pet lovers saving lives. Whether you're donating or requesting,
            PetPal makes it fast, easy, and safe.
          </p>
        </div>
      </div>
    </>
  );
};

export default DetailsPage;
