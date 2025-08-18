import React, { useState, useEffect } from 'react';
import { StarFill, Clock, Truck, ShieldCheck, BorderBottom } from 'react-bootstrap-icons';

export const OfferPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const offerDetails = {
    title: "Summer Special Discount",
    description: "Get amazing deals on our premium products for a limited time only! Stock up on your favorites before this offer ends.",
    discount: "30% OFF",
    validUntil: "July 31, 2023",
    features: [
      "On all organic snacks and superfoods",
      "Minimum order ₹499",
      "Free shipping on orders above ₹999",
      "Use code: SUMMER30 at checkout"
    ]
  };

  const popularProducts = [
    {
      id: 1,
      name: "Organic Almonds",
      price: "₹349",
      originalPrice: "₹499",
      rating: 4.5,
      image: "https://thumbs.dreamstime.com/b/bowl-organic-almond-nuts-badam-background-selective-focus-photograph-66384261.jpg"
    },
    {
      id: 2,
      name: "Mixed Dry Fruits",
      price: "₹279",
      originalPrice: "₹399",
      rating: 4.2,
      image: "https://static.vecteezy.com/system/resources/thumbnails/028/348/064/small_2x/footer-of-mix-dry-fruit-on-white-background-ai-generated-photo.jpg"
    },
    {
      id: 3,
      name: "Protein Nut Mix",
      price: "₹315",
      originalPrice: "₹450",
      rating: 4.7,
      image: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/trail-mix-snack-1296x728-header.jpeg?w=1155&h=1528"
    }
  ];

  const handleProductHover = (productId) => {
    setHoveredProduct(productId);
  };

  const handleProductLeave = () => {
    setHoveredProduct(null);
  };

  return (
    <div style={{
      // maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Main Offer Banner */}
      <div style={{
        display: 'flex',
        background: 'linear-gradient(135deg, #fff8f8, #fff)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '40px',
        flexDirection: isMobile ? 'column' : 'row',
        gap:'10px'

      }}>
        <div style={{
          position: 'relative',
          flex: 1,
          minHeight: isMobile ? '100px' : '400px'
        }}>
          <img 
            src="https://www.farmley.com/cdn/shop/files/rd_with_date_bites-80_1400x.jpg?v=1715246493" 
            alt="Special Offer" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} 
          />
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#ff4444',
            color: 'white',
            padding: isMobile ? '8px 15px' : '10px 20px',
            borderRadius: '6px',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {offerDetails.discount}
          </div>
        </div>
        
        <div style={{
          flex: 1,
          padding: isMobile ? '25px' : '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            color: '#333',
            marginBottom: '1rem'
          }}>{offerDetails.title}</h1>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>{offerDetails.description}</p>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1rem',
              color: '#666'
            }}>
              <Clock size={20} />
              <span>Valid until: {offerDetails.validUntil}</span>
            </div>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '1.5rem 0'
            }}>
              {offerDetails.features.map((feature, index) => (
                <li key={index} style={{
                  marginBottom: '0.8rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <button style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            alignSelf: isMobile ? 'center' : 'flex-start',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            width: isMobile ? '100%' : 'auto',
            textAlign: 'center',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(255, 107, 107, 0.4)'
            }
          }}>
            Shop Now & Save
          </button>
        </div>
      </div>

      {/* Popular Products Section */}
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#333',
          marginBottom: '30px',
          position: 'relative'
        }}>
          Popular Products on Offer
          <div style={{
            content: '',
            display: 'block',
            width: '80px',
            height: '3px',
            background: '#ff4444',
            margin: '15px auto 0'
          }}></div>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? (window.innerWidth <= 480 ? '1fr' : 'repeat(2, 1fr)') : 'repeat(3, 1fr)',
          gap: '25px'
        }}>
          {popularProducts.map(product => (
            <div 
              key={product.id} 
              style={{
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease',
                transform: hoveredProduct === product.id ? 'translateY(-5px)' : 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={() => handleProductHover(product.id)}
              onMouseLeave={handleProductLeave}
            >
              {/* Product Image */}
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    transform: hoveredProduct === product.id ? 'scale(1.05)' : 'none'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/trail-mix-snack-1296x728-header.jpeg?w=1155&h=1528';
                    e.target.style.objectFit = 'contain';
                  }}
                />
                {/* Discount Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {offerDetails.discount}
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#333',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{product.name}</h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginBottom: '0.8rem'
                }}>
                  {[...Array(5)].map((_, i) => (
                    <StarFill 
                      key={i} 
                      style={{ 
                        color: i < Math.floor(product.rating) ? '#FFD700' : '#ddd',
                        fontSize: '1rem'
                      }} 
                    />
                  ))}
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>({product.rating})</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#ff4444'
                  }}>{product.price}</span>
                  <span style={{
                    fontSize: '1rem',
                    color: '#999',
                    textDecoration: 'line-through'
                  }}>{product.originalPrice}</span>
                </div>
                
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: '#6e8efb',
                    color: 'white',
                    borderColor: '#6e8efb'
                  }
                }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '30px',
        background: '#f9f9f9',
        borderRadius: '12px',
        marginTop: '40px',
          BorderTop: '1px solid #695f5f',
          BorderBottom: '1px solid #695f5f',
  // border-bottom: 1px solid #695f5f,
        flexDirection: isMobile && window.innerWidth <= 480 ? 'column' : 'row'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          flex: 1,
          minWidth: '200px'
        }}>
          <Truck size={32} style={{ color: '#6e8efb', marginBottom: '15px' }} />
          <h4 style={{
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
            color: '#333'
          }}>Free Shipping</h4>
          <p style={{
            color: '#666',
            fontSize: '0.9rem'
          }}>On orders above ₹999</p>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          flex: 1,
          minWidth: '200px'
        }}>
          <Clock size={32} style={{ color: '#6e8efb', marginBottom: '15px' }} />
          <h4 style={{
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
            color: '#333'
          }}>24/7 Support</h4>
          <p style={{
            color: '#666',
            fontSize: '0.9rem'
          }}>Dedicated customer care</p>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          flex: 1,
          minWidth: '200px'
        }}>
          <ShieldCheck size={32} style={{ color: '#6e8efb', marginBottom: '15px' }} />
          <h4 style={{
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
            color: '#333'
          }}>Secure Payment</h4>
          <p style={{
            color: '#666',
            fontSize: '0.9rem'
          }}>100% secure checkout</p>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;