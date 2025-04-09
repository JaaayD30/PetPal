import React from 'react';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to PetPal</h1>
        <p style={styles.subtitle}>Connecting Pet Owners with Potential Blood Donors</p>
      </header>

      <section style={styles.content}>
        <p style={styles.text}>
          PetPal is designed to help pet owners find blood donors for their pets in emergency situations.
          With just a few clicks, you can connect with willing donors nearby and ensure your pet receives
          the care it needs in times of crisis.
        </p>
        <button style={styles.button}>Get Started</button>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 PetPal. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
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
  content: {
    padding: '30px',
    backgroundColor: '#fff',
    flex: 1,
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
  },
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
  },
  footerText: {
    margin: 0,
  },
};

export default LandingPage;
