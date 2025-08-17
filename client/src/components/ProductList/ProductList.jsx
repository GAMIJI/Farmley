import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StarFill, StarHalf, Search, CartPlus, CartCheck } from "react-bootstrap-icons";
import styled, { keyframes } from "styled-components";
import "./ProductList.css";

// Styled Components for Auth Modal
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const ProductList = () => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const sliderRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, cartRes] = await Promise.all([
          axios.get(`${API_URL}products`),
          fetchCartItems()
        ]);
        
        if (Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        } else {
          console.error("Unexpected products data:", productsRes.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userData");
    if (!token || !userId) return [];

    try {
      const res = await axios.get(`${API_URL}cart/addToCart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.data || []);
      return res.data.data || [];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
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

    if (cartItems.some(item => item.productId?._id === productId)) return;

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
      alert("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAuthConfirm = () => {
    navigate("/login", { 
      state: { 
        from: "product-list",
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

  const handleProductDetails = (id) => {
    localStorage.setItem("productid", id);
    navigate("/productdetail");
  };

  const scrollSlider = (category, direction) => {
    const slider = sliderRefs.current[category];
    if (slider) {
      const scrollAmount = direction === "right" ? 300 : -300;
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const generateRating = () => {
    const rating = (Math.random() * 5).toFixed(1);
    return {
      value: rating,
      stars: Array(5).fill(0).map((_, i) => {
        if (i < Math.floor(rating)) return <StarFill key={i} className="text-warning" />;
        if (i === Math.floor(rating) && rating % 1 >= 0.5) return <StarHalf key={i} className="text-warning" />;
        return <StarFill key={i} className="text-secondary" />;
      })
    };
  };

  return (
    <div className="product-list-container">
      {/* Hero Search Section */}
      <div className="hero-search-section">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends and best deals</p>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="search-input-group">
              <span className="search-icon">
                <Search size={20} />
              </span>
              <input
                type="search"
                placeholder="Search for products, brands, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="product-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category} className="product-category-section">
            <div className="category-header">
              <h2>{category}</h2>
              {items.length > 2 && (
                <div className="slider-controls">
                  <button 
                    className="slider-arrow left" 
                    onClick={() => scrollSlider(category, "left")}
                    aria-label={`Scroll ${category} left`}
                  >
                    &larr;
                  </button>
                  <button 
                    className="slider-arrow right" 
                    onClick={() => scrollSlider(category, "right")}
                    aria-label={`Scroll ${category} right`}
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>

            <div className="slider-container">
              <div
                className="product-slider"
                ref={(el) => (sliderRefs.current[category] = el)}
              >
                {items.map(product => {
                  const isInCart = cartItems.some(item => item.productId?._id === product._id);
                  const rating = generateRating();
                  const discountPercent = product.oldPrice
                    ? Math.round((1 - product.price / product.oldPrice) * 100)
                    : 0;

                  return (
                    <div key={product._id} className="product-card">
                      <div 
                        className="product-image-container"
                        onClick={() => handleProductDetails(product._id)}
                      >
                        <div className="image-wrapper">
                          <img
                            src={`${API_URL.replace('/api/', '')}${product.imageUrl}`}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.png';
                              e.target.style.objectFit = 'contain';
                            }}
                          />
                        </div>
                        
                        {product.oldPrice && (
                          <div className="discount-badge">
                            {discountPercent}% OFF
                          </div>
                        )}
                        <div className="quick-view">Quick View</div>
                      </div>

                      <div className="product-info">
                        <h3 className="product-title" title={product.name}>
                          {product.name}
                        </h3>
                        
                        <div className="product-rating">
                          <div className="stars">
                            {rating.stars}
                          </div>
                          <span>({rating.value})</span>
                        </div>
                        
                        <div className="product-pricing">
                          <span className="current-price">₹{product.price}</span>
                          {product.oldPrice && (
                            <span className="original-price">₹{product.oldPrice}</span>
                          )}
                        </div>
                        
                        <button
                          className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''} ${addingToCart && pendingProductId === product._id ? 'adding' : ''}`}
                          onClick={() => handleAddToCart(product._id)}
                          disabled={isInCart || (addingToCart && pendingProductId === product._id)}
                          aria-label={isInCart ? 'Added to cart' : 'Add to cart'}
                        >
                          {addingToCart && pendingProductId === product._id ? (
                            <span className="adding-text">Adding...</span>
                          ) : isInCart ? (
                            <>
                              <CartCheck size={16} /> Added
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
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && Object.keys(groupedProducts).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
          <button onClick={() => setSearchTerm('')}>
            Clear Search
          </button>
        </div>
      )}

      {/* Auth Modal */}
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

export default ProductList;