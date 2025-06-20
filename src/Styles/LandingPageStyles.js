const styles = {
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    notificationDropdown: {
      position: 'absolute',
      top: '120%', // below the bell
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '250px',
      zIndex: 999,
      padding: '10px',
    },
    
    notificationItem: {
      fontSize: '14px',
      color: 'black',
      padding: '5px 0',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    notificationDot: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: '10px',
      width: '10px',
      backgroundColor: 'red',
      borderRadius: '50%',
    },
    
    clearAllButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '12px',
      cursor: 'pointer',
    },
    
    clearOneButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '12px',
      cursor: 'pointer',
    },
    
    dropdownHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      fontWeight: 'bold',
    },  
    
  
    fullscreenOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1500,
      cursor: 'pointer',
    },
  
    fullscreenImage: {
      maxWidth: '90%',
      maxHeight: '90%',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      cursor: 'default',
    },
  
    fullscreenCloseButton: {
      position: 'fixed',
      top: '20px',
      right: '30px',
      fontSize: '2rem',
      color: 'white',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      userSelect: 'none',
      zIndex: 1600,
    },
  
    // Nav & layout
    cardNavigation: {
      marginTop: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
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
  
    // Card styles
    card: {
      cursor: 'pointer',
      backgroundColor: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      margin: '0 1rem',
    },
  
    cardExpanded: {
      position: 'relative',
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '10px',
      maxWidth: '600px',
      width: '90%',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
      height: '65vh',
      maxHeight: '90vh',
    },
  
    // Modal overlay for expanded pet card
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    // Card content inside the card/modal
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
  
    allImagesModal: {
      background: '#fff',
      padding: '20px',
      borderRadius: '12px',
      maxWidth: '80vw',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    
    allImagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '10px',
      marginTop: '10px',
    },
    
    fullImageThumbnail: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    
  
    // Other styles (navbar, search, dropdown, form, etc.) remain unchanged
    navbar: {
      backgroundColor: '#f28b39',
      display: 'flex',
      justifyContent: 'center',
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
      marginRight: 'auto',
    },
  
    searchContainer: {
      width: '300px',
      margin: '0 auto',
    },
  
    searchInput: {
      width: '100%',
      padding: '0.4rem 0.75rem',
      borderRadius: '4px',
      border: 'none',
      fontSize: '1rem',
    },
  
    profileSection: {
      position: 'relative',
      marginLeft: 'auto',
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
      color: '#333',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
    },
  
    dropdownItem: {
      padding: '0.5rem 1rem',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      textAlign: 'left',
    },
  
    header: {
      textAlign: 'center',
      marginTop: '1rem',
    },
  
    title: {
      fontSize: '2.4rem',
      color: '#334e68',
      marginBottom: '0.25rem',
    },
  
    subtitle: {
      fontSize: '1.1rem',
      color: '#557a95',
      marginTop: 0,
    },
  
    imagesContainer: {
      display: 'flex',
      gap: '8px',
      marginTop: '10px',
      flexWrap: 'wrap',
    },
  
    thumbnail: {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '5px',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'border-color 0.3s',
    },
  
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 100,
    },
  
    modalImage: {
      maxWidth: '90vw',
      maxHeight: '80vh',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(255,255,255,0.5)',
    },
  
    heartButton: {
      position: 'absolute',
      bottom: '1rem',
      left: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '2rem',
      cursor: 'pointer',
    },
    
    connectButton: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#FA9A51',
      color: '#fff',
      padding: '10px 18px',
      border: 'none',
      borderRadius: '30px',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    },
    
  
    popupOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
  
    popup: {
      backgroundColor: 'white',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '480px',
      padding: '1.5rem',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
  
    formLabel: {
      marginTop: '0.75rem',
      marginBottom: '0.25rem',
      fontWeight: '600',
    },
  
    formInput: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
  
    formButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem',
    },
  
    submitButton: {
      backgroundColor: '#357edd',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  
    cancelButton: {
      backgroundColor: '#999',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  
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
    },
  };
  
  export default styles;