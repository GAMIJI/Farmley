import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import '../style/FrontPage.css';

const FrontPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = () => {
    navigate("/ProductsPage");
  };

  const banners = [
    {
      id: 1,
      desktopImage: "https://www.farmley.com/cdn/shop/files/rd_with_date_bites-80_1400x.jpg?v=1715246493",
      mobileImage: "https://www.farmley.com/cdn/shop/files/Date_Bites_Mobile_700x.jpg?v=1751887974",
      alt: "Healthy snacks",
      title: "Premium Healthy Snacks",
      subtitle: "Discover our nutritious date bites"
    },
    {
      id: 2,
      desktopImage: "https://www.farmley.com/cdn/shop/files/rd_with_snack_mix-80_1400x.jpg?v=1715246522",
      mobileImage: "https://via.placeholder.com/600x900/2196F3/FFFFFF?text=Nut+Mixes",
      alt: "Nut mixes",
      title: "Crunchy Nut Mixes",
      subtitle: "Perfect protein-packed snacks"
    },
    {
      id: 3,
      desktopImage: "https://www.farmley.com/cdn/shop/files/Farmley_Cranberry_Apricots_1400x.png?v=1715062209",
      mobileImage: "https://via.placeholder.com/600x900/FF9800/FFFFFF?text=Dried+Fruits",
      alt: "Dried fruits",
      title: "Natural Dried Fruits",
      subtitle: "No added sugar, just nature's sweetness"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="front-page-container">
      {/* Banner Carousel with Navigation */}
      <div className="banner-carousel">
        <div className="slide-container">
          {banners.map((banner, index) => (
            <div 
              key={banner.id} 
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              onClick={handleNavigation}
            >
              <img
                src={isMobile ? banner.mobileImage : banner.desktopImage}
                alt={banner.alt}
                className="banner-image"
              />
              <div className="slide-content">
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>
                <button className="shop-now-btn">Shop Now</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button className="nav-arrow prev-arrow" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="nav-arrow next-arrow" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
        
        {/* Slide Indicators */}
        <div className="slide-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-container">
        <div className="benefit-item">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" 
            alt="Check mark" 
            className="check-icon"
          />
          <span>100% Plant-Based</span>
        </div>
        
        <div className="benefit-item">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" 
            alt="Check mark" 
            className="check-icon"
          />
          <span>Real Fruits, Nuts & SuperFood</span>
        </div>
        
        <div className="benefit-item">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" 
            alt="Check mark" 
            className="check-icon"
          />
          <span>No Preservatives or Added Sugar</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bottom-bar-content  ">
          <div className="bar-item">
            <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="Free Shipping" />
            <span>Free Shipping</span>
          </div>
          <div className="bar-item">
            <img src="https://cdn-icons-png.flaticon.com/512/929/929452.png" alt="Easy Returns" />
            <span>Easy Returns</span>
          </div>
          <div className="bar-item">
            <img src="https://cdn-icons-png.flaticon.com/512/3050/3050158.png" alt="Secure Payment" />
            <span>Secure Payment</span>
          </div>
          <div className="bar-item">
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081160.png" alt="24/7 Support" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;