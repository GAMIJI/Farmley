import React from 'react';
import { useNavigate } from 'react-router-dom';

const FrontPage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/ProductsPage");
  };

  // Responsive inline styles
  const styles = {
    container: {
      // maxWidth: '1200px',
      // margin: '0 auto',
      padding: '20px',
      width: '100%',
      boxSizing: 'border-box',
    },
    carousel: {
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '30px',
    },
    carouselImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '500px',
      objectFit: 'cover',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      '@media (max-width: 768px)': {
        maxHeight: '300px',
      },
      '@media (max-width: 480px)': {
        maxHeight: '200px',
      },
    },
    benefitsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap',
      margin: '40px 0',
      '@media (max-width: 768px)': {
        gap: '15px',
        margin: '20px 0',
      },
    },
    benefitItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: '#f8f9fa',
      padding: '12px 20px',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      '@media (max-width: 768px)': {
        fontSize: '14px',
        padding: '8px 15px',
      },
      '@media (max-width: 480px)': {
        fontSize: '12px',
        padding: '6px 12px',
        borderRadius: '30px',
      },
    },
    checkIcon: {
      width: '18px',
      height: '18px',
      '@media (max-width: 480px)': {
        width: '14px',
        height: '14px',
      },
    },
    carouselControl: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      top: '50%',
      transform: 'translateY(-50%)',
      '@media (max-width: 768px)': {
        width: '30px',
        height: '30px',
      },
    },
    carouselIndicator: {
      '@media (max-width: 480px)': {
        marginBottom: '10px',
      },
    },
  };

  // Function to apply responsive styles
  const applyStyles = (baseStyles) => {
    return {
      ...baseStyles,
      ...(window.innerWidth <= 768 && baseStyles['@media (max-width: 768px)']),
      ...(window.innerWidth <= 480 && baseStyles['@media (max-width: 480px)']),
    };
  };

  return (
    <div style={applyStyles(styles.container)}>
      {/* Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide" style={applyStyles(styles.carousel)}>
        <div className="carousel-indicators" style={applyStyles(styles.carouselIndicator)}>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        
        <div className="carousel-inner">
          <div className="carousel-item active" onClick={handleNavigation}>
            <img 
              src="https://www.farmley.com/cdn/shop/files/rd_with_date_bites-80_1400x.jpg?v=1715246493" 
              className="d-block w-100" 
              alt="Healthy snacks"
              style={applyStyles(styles.carouselImage)}
            />
          </div>
          <div className="carousel-item" onClick={handleNavigation}>
            <img 
              src="https://www.farmley.com/cdn/shop/files/rd_with_snack_mix-80_1400x.jpg?v=1715246522" 
              className="d-block w-100" 
              alt="Nut mixes"
              style={applyStyles(styles.carouselImage)}
            />
          </div>
          <div className="carousel-item" onClick={handleNavigation}>
            <img 
              src="https://www.farmley.com/cdn/shop/files/Farmley_Cranberry_Apricots_1400x.png?v=1715062209" 
              className="d-block w-100" 
              alt="Dried fruits"
              style={applyStyles(styles.carouselImage)}
            />
          </div>
        </div>
        
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" style={applyStyles(styles.carouselControl)}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" style={applyStyles(styles.carouselControl)}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      
      {/* Benefits Section */}
      <div style={applyStyles(styles.benefitsContainer)}>
        <div style={applyStyles(styles.benefitItem)}>
          <img 
            src="https://w7.pngwing.com/pngs/355/107/png-transparent-computer-icons-verify-silhouette-share-icon-check-mark-thumbnail.png" 
            alt="Check mark" 
            style={applyStyles(styles.checkIcon)}
          />
          100% Plant-Based
        </div>
        
        <div style={applyStyles(styles.benefitItem)}>
          <img 
            src="https://w7.pngwing.com/pngs/355/107/png-transparent-computer-icons-verify-silhouette-share-icon-check-mark-thumbnail.png" 
            alt="Check mark" 
            style={applyStyles(styles.checkIcon)}
          />
          Real Fruits, Nuts & SuperFood
        </div>
        
        <div style={applyStyles(styles.benefitItem)}>
          <img 
            src="https://w7.pngwing.com/pngs/355/107/png-transparent-computer-icons-verify-silhouette-share-icon-check-mark-thumbnail.png" 
            alt="Check mark" 
            style={applyStyles(styles.checkIcon)}
          />
          No Preservatives or Added Sugar
        </div>
      </div>
    </div>
  );
};

export default FrontPage;