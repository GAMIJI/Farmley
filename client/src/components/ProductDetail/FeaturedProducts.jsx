import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarFill, StarHalf, CartPlus, CartCheck } from 'react-bootstrap-icons';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const AuthPrompt = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  .auth-modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    animation: ${fadeIn} 0.3s ease;
  }

  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
    min-width: 120px;
  }

  .login-btn {
    background: #6e8efb;
    color: white;
    border: none;

    &:hover {
      background: #5a7df4;
      transform: translateY(-2px);
    }
  }

  .cancel-btn {
    background: transparent;
    border: 1px solid #ddd;
    color: #666;

    &:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 480px) {
    .auth-modal {
      padding: 1.5rem;
    }
    
    button {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(110, 142, 251, 0.1);
    border-radius: 50%;
    border-top-color: #6e8efb;
    animation: ${spin} 1s linear infinite;
    margin: 0 auto 20px;
  }

  p {
    color: #666;
    font-size: 1rem;
  }
`;

const FeaturedProducts = () => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}products`);
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userData");
    if (!token || !userId) return;

    try {
      const res = await axios.get(`${API_URL}cart/addToCart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setPendingProductId(productId);
      setShowAuthModal(true);
      return;
    }

    if (cartItems.some(item => item.productId._id === productId)) return;

    setAddingToCart(true);
    try {
      await axios.post(
        `${API_URL}cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAuthConfirm = () => {
    navigate("/login", { 
      state: { 
        from: "featured-products",
        message: "Please login to add items to your cart",
        returnUrl: window.location.pathname
      } 
    });
    setShowAuthModal(false);
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
    setPendingProductId(null);
  };

  const generateRating = () => {
    const rating = (Math.random() * 5).toFixed(1);
    return {
      value: rating,
      stars: Array(5).fill(0).map((_, i) => {
        if (i < Math.floor(rating)) return <StarFill key={i} style={{ color: '#FFD700' }} />;
        if (i === Math.floor(rating) && rating % 1 >= 0.5) return <StarHalf key={i} style={{ color: '#FFD700' }} />;
        return <StarFill key={i} style={{ color: '#ddd' }} />;
      })
    };
  };

  const handleProductDetails = (id) => {
    localStorage.setItem("productid", id);
    navigate("/productdetail");
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="spinner"></div>
        <p>Loading featured products...</p>
      </LoadingContainer>
    );
  }

  return (
    <div style={{
      margin: '0 auto',
      padding: '40px 20px',
      maxWidth: '1200px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    }}>
      {/* Header section with title and view all button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#333',
          position: 'relative',
          margin: '0'
        }}>
          Featured Products
          <div style={{
            content: '',
            display: 'block',
            width: '80px',
            height: '3px',
            background: '#6e8efb',
            margin: '15px 0 0 0'
          }}></div>
        </h2>

        <button
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#6e8efb',
            border: '2px solid #6e8efb',
            borderRadius: '30px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(110, 142, 251, 0.2)',
          }}
          onClick={() => navigate('/ProductList')}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#6e8efb';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(110, 142, 251, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#6e8efb';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(110, 142, 251, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          View All Products
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'transform 0.3s ease' }}
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      {/* Products grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        padding: '0 20px'
      }}>
        {featuredProducts.map(product => {
          const isInCart = cartItems.some(item => item.productId?._id === product._id);
          const rating = generateRating();
          const discountPercent = product.oldPrice
            ? Math.round((1 - product.price / product.oldPrice) * 100)
            : 0;

          return (
            <div key={product._id} style={{
              background: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }} onClick={() => handleProductDetails(product._id)}>
                <img
                  src={`${API_URL.replace('/api/', '')}${product.imageUrl}`}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.5s ease'
                  }}
                />

                {product.oldPrice && (
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
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem',
                  color: '#333',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} onClick={() => handleProductDetails(product._id)}>
                  {product.name}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginBottom: '0.8rem'
                }}>
                  {rating.stars}
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>({rating.value})</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#ff4444'
                  }}>₹{product.price}</span>
                  {product.oldPrice && (
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#999',
                      textDecoration: 'line-through'
                    }}>₹{product.oldPrice}</span>
                  )}
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: isInCart ? '#4CAF50' : '#6e8efb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: isInCart ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: addingToCart && pendingProductId === product._id ? 0.7 : 1,
                    position: 'relative'
                  }}
                  onClick={() => handleAddToCart(product._id)}
                  disabled={isInCart || (addingToCart && pendingProductId === product._id)}
                >
                  {addingToCart && pendingProductId === product._id ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: `${spin} 1s linear infinite`,
                        marginRight: '8px'
                      }}></div>
                      Adding...
                    </>
                  ) : isInCart ? (
                    <>
                      <CartCheck size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <CartPlus size={16} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {featuredProducts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No featured products available at the moment.</p>
        </div>
      )}

      {showAuthModal && (
        <AuthPrompt>
          <div className="auth-modal">
            <h3>Login Required</h3>
            <p>You need to login to add items to your cart. Would you like to login now?</p>
            <div className="button-group">
              <button className="login-btn" onClick={handleAuthConfirm}>
                Login
              </button>
              <button className="cancel-btn" onClick={handleAuthCancel}>
                Cancel
              </button>
            </div>
          </div>
        </AuthPrompt>
      )}
    </div>
  );
};

export default FeaturedProducts;