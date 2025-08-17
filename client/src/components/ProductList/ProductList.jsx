import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StarFill, StarHalf, Search, CartPlus, CartCheck } from "react-bootstrap-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ProductList.css";

const ProductList = () => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [productRatings, setProductRatings] = useState({});
  const sliderRefs = useRef({});

  // Generate stable rating based on product ID
  const generateStableRating = (productId) => {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = (hash % 50) / 10; // Gives a rating between 0 and 4.9
    return {
      value: rating.toFixed(1),
      stars: Array(5).fill(0).map((_, i) => {
        if (i < Math.floor(rating)) return <StarFill key={i} className="text-warning" />;
        if (i === Math.floor(rating) && rating % 1 >= 0.5) return <StarHalf key={i} className="text-warning" />;
        return <StarFill key={i} className="text-secondary" />;
      })
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, cartRes] = await Promise.all([
          axios.get(`${API_URL}products`),
          fetchCartItems()
        ]);
        
        if (Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
          // Initialize stable ratings
          const ratings = {};
          productsRes.data.forEach(product => {
            ratings[product._id] = generateStableRating(product._id);
          });
          setProductRatings(ratings);
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
    if (!token) return [];

    try {
      const res = await axios.get(`${API_URL}cart/addToCart`, {
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

    setAddingToCart(productId);

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
      setAddingToCart(null);
    }
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

  return (
    <div className="product-list-container">
      <ToastContainer />
      
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
                  const isInCart = cartItems.some(item => item.productId._id === product._id);
                  const rating = productRatings[product._id] || { value: "0.0", stars: [] };
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
                          className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''} ${addingToCart === product._id ? 'adding' : ''}`}
                          onClick={() => handleAddToCart(product._id)}
                          disabled={isInCart || addingToCart === product._id}
                          aria-label={isInCart ? 'Added to cart' : 'Add to cart'}
                        >
                          {addingToCart === product._id ? (
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
    </div>
  );
};

export default ProductList;