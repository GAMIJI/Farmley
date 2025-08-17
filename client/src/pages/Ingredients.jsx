import React from 'react';

export const Ingredients = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f7',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <h2 style={{
        fontSize: '2rem',
        color: '#2a5c3a',
        marginBottom: '40px',
        textAlign: 'center',
        fontWeight: '600'
      }}>
        Premium Ingredients, Unmatched Quality
      </h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '40px',
        maxWidth: '1200px',
        width: '100%'
      }}>
        <div style={{
          flex: '1 1 400px',
          maxWidth: '500px',
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="https://www.farmley.com/cdn/shop/files/Datebite2_0.8x-20_500x.jpg?v=1715064885" 
            alt="Farmley Ingredients" 
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.5s ease'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            padding: '20px',
            color: 'white'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>100% Natural</h3>
            <p style={{ margin: '0', opacity: '0.9' }}>Sourced from trusted farms</p>
          </div>
        </div>
        
        <div style={{
          flex: '1 1 400px',
          maxWidth: '500px',
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="https://www.farmley.com/cdn/shop/files/Datebite_usecase001_500x.jpg?v=1716890519" 
            alt="Pocket-Size Convenience" 
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.5s ease'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            padding: '20px',
            color: 'white'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Perfectly Portable</h3>
            <p style={{ margin: '0', opacity: '0.9' }}>Healthy snacks on-the-go</p>
          </div>
        </div>
      </div>
      
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
        maxWidth: '800px',
        padding: '0 20px'
      }}>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#333'
        }}>
          Our products are made with carefully selected ingredients, free from artificial preservatives and additives. 
          Each bite delivers natural goodness and nutrition you can trust.
        </p>
        <button style={{
          marginTop: '20px',
          padding: '12px 30px',
          backgroundColor: '#2a5c3a',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Discover Our Ingredients
        </button>
      </div>
    </div>
  );
};

export default Ingredients;