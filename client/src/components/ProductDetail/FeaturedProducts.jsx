import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarFill, StarHalf, CartPlus, CartCheck } from 'react-bootstrap-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeaturedProducts = () => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}products`);
        setFeaturedProducts(response.data.slice(0, 4)); // Show first 4 featured products
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
    if (!token) return [];

    try {
      const res = await axios.get(`${API_URL}cart/addToCart`, {
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
      toast.info("Please login to add items to cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return navigate("/login");
    }

    if (cartItems.some(item => item.productId._id === productId)) {
      toast.warn("This item is already in your cart!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setAddingToCart(productId); // Set loading state for this product

    try {
      await axios.post(
        `${API_URL}cart/add`,
        { userId, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCartItems();
      toast.success("Item successfully added to your cart!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setAddingToCart(null); // Reset loading state
    }
  };

  const handleProductDetails = (id) => {
    localStorage.setItem("productid", id);
    navigate("/productdetail");
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner"></div>
        <p>Loading featured products...</p>
      </div>
    );
  }

  return (
    <div style={{
      margin: '0 auto',
      padding: '25px 20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      position: 'relative'
    }}>
      <ToastContainer />
      
      {/* Header section with title and view all button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        // flexWrap: 'wrap'
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
            padding: '2px 12px',
            background: 'white',
            color: '#6e8efb',
            border: '2px solid #6e8efb',
            borderRadius: '30px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(110, 142, 251, 0.2)',
            ':hover': {
              background: '#6e8efb',
              color: 'white',
              boxShadow: '0 4px 12px rgba(110, 142, 251, 0.3)',
              transform: 'translateY(-2px)'
            },
            ':active': {
              transform: 'translateY(0)'
            }
          }}
          onClick={() => navigate('/ProductList')}
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
          const isInCart = cartItems.some(item => item.productId._id === product._id);
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
              cursor: 'pointer'
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
                    opacity: addingToCart === product._id ? 0.7 : 1
                  }}
                  onClick={() => !isInCart && handleAddToCart(product._id)}
                  disabled={isInCart || addingToCart === product._id}
                >
                  {isInCart ? (
                    <>
                      <CartCheck size={16} /> Added to Cart
                    </>
                  ) : addingToCart === product._id ? (
                    <>
                      <div className="spinner" style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Adding...
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FeaturedProducts;