import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiHeart,
  FiChevronRight,
  FiStar,
  FiUser,
  FiChevronLeft,
  FiChevronDown
} from 'react-icons/fi';

const token = localStorage.getItem("token");
const API_URL = process.env.REACT_APP_API_BASE_URL;

const staticReviews = [
  {
    id: 1,
    user: 'John Doe',
    rating: 5,
    date: '2023-05-15',
    comment: 'Excellent product! Better than I expected. The quality is superb and it arrived quickly.'
  },
  {
    id: 2,
    user: 'Jane Smith',
    rating: 4,
    date: '2023-04-22',
    comment: 'Very good product, but the color was slightly different than shown in the picture.'
  },
  {
    id: 3,
    user: 'Robert Johnson',
    rating: 5,
    date: '2023-03-10',
    comment: 'Absolutely love it! Would definitely buy again. Great value for the price.'
  },
  {
    id: 4,
    user: 'Emily Davis',
    rating: 3,
    date: '2023-02-28',
    comment: 'Product is okay, but the shipping took longer than expected.'
  }
];

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState(staticReviews);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  console.log("fg",token);
  

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock multiple images
  const productImages = useMemo(() => {
    if (!product) return [];
    return [
      product.imageUrl,
      product.imageUrl.replace('.jpg', '-2.jpg'),
      product.imageUrl.replace('.jpg', '-3.jpg'),
      product.imageUrl.replace('.jpg', '-4.jpg')
    ];
  }, [product]);

  const product_id = useMemo(() => localStorage.getItem('productid'), []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Fetch product data
  useEffect(() => {
    if (!product_id || product_id === 'undefined') {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);

        const productResponse = await axios.get(`${API_URL}products/${product_id}`);
        setProduct(productResponse.data);

        if(token){
          const cartResponse = await axios.get(`${API_URL}cart/addToCart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const inCart = cartResponse.data.data?.some(item => item.productId._id === product_id);
          setIsInCart(inCart);
        }

        // if (productResponse.data.category) {
        //   const relatedResponse = await axios.get(
        //     `${API_URL}products?category=${productResponse.data.category}&limit=4`
        //   );
        //   setRelatedProducts(
        //     relatedResponse.data.filter(p => p._id !== product_id)
        //   );
        // }

      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [product_id]);

  const handleAddToCart = useCallback(async () => {
    if (!product_id || isInCart) return;

    try {
      await axios.post(
        `${API_URL}cart/add`,
        { productId: product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInCart(true);
    } catch (error) {
      console.error('Cart error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [product_id, quantity, isInCart, navigate]);

  const toggleWishlist = useCallback(() => {
    setIsWishlisted(prev => !prev);
  }, []);

  const handleProductClick = useCallback((id) => {
    localStorage.setItem('productid', id);
    navigate('/productdetail');
  }, [navigate]);

  const nextImage = useCallback(() => {
    setSelectedImageIndex(prev => (prev + 1) % productImages.length);
  }, [productImages.length]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex(prev => (prev - 1 + productImages.length) % productImages.length);
  }, [productImages.length]);

  const selectImage = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar
        key={i}
        color={i < rating ? '#f59e0b' : '#d1d5db'}
        fill={i < rating ? '#f59e0b' : 'none'}
        size={windowWidth < 480 ? 14 : 16}
      />
    ));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(79, 70, 229, 0.1)',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#fee2e2',
        color: '#b91c1c',
        borderRadius: '8px',
        margin: '20px',
        textAlign: 'center'
      }}>
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        padding: '20px',
        background: '#f3f4f6',
        borderRadius: '8px',
        margin: '20px',
        textAlign: 'center'
      }}>
        Product not found
      </div>
    );
  }

  const isMobile = windowWidth < 768;
  const isSmallMobile = windowWidth < 480;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '15px' : '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Product Detail Section */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '30px' : '40px'
      }}>
        {/* Product Images Gallery */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minWidth: isMobile ? '100%' : '50%'
        }}>
          {/* Main Image */}
          <div style={{
            position: 'relative',
            height: isMobile ? (isSmallMobile ? '250px' : '300px') : '400px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f3f4f6'
          }}>
            <img
              src={`${API_URL.replace('/api/', '')}${productImages[selectedImageIndex]}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />

            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)',
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }}
                >
                  <FiChevronLeft size={isMobile ? 18 : 20} color="#4b5563" />
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)',
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }}
                >
                  <FiChevronRight size={isMobile ? 18 : 20} color="#4b5563" />
                </button>
              </>
            )}

            <button
              onClick={toggleWishlist}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.9)',
                width: isMobile ? '40px' : '44px',
                height: isMobile ? '40px' : '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 2
              }}
            >
              <FiHeart
                size={isMobile ? 18 : 20}
                color={isWishlisted ? '#ef4444' : '#6b7280'}
                fill={isWishlisted ? '#ef4444' : 'none'}
              />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div>
              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: isSmallMobile ? '14px' : '16px'
                }}
              >
                {showThumbnails ? 'Hide thumbnails' : 'Show thumbnails'}
                <FiChevronDown
                  size={isSmallMobile ? 14 : 16}
                  style={{
                    transform: showThumbnails ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>

              {showThumbnails && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(isSmallMobile ? 2 : 4, productImages.length)}, 1fr)`,
                  gap: '8px'
                }}>
                  {productImages.map((img, index) => (
                    <motion.div
                      key={index}
                      onClick={() => selectImage(index)}
                      whileHover={{ scale: 1.03 }}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImageIndex === index ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={`${API_URL.replace('/api/', '')}${img}`}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {selectedImageIndex === index && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(79, 70, 229, 0.1)'
                        }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{
          flex: 1,
          padding: isMobile ? '0' : '0 10px',
          minWidth: isMobile ? '100%' : '50%'
        }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 style={{
              fontSize: isSmallMobile ? '22px' : isMobile ? '24px' : '28px',
              fontWeight: '700',
              marginBottom: '12px',
              color: '#1f2937'
            }}>{product.name}</h1>

            {/* Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#4f46e5',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: isSmallMobile ? '12px' : '14px'
              }}>
                <FiStar style={{ marginRight: '4px' }} />
                {averageRating}
              </div>
              <span style={{
                color: '#6b7280',
                fontSize: isSmallMobile ? '12px' : '14px'
              }}>
                ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <span style={{
                fontSize: isSmallMobile ? '20px' : '24px',
                fontWeight: '700',
                color: '#4f46e5'
              }}>₹{product.price}</span>

              {product.oldPrice && (
                <span style={{
                  fontSize: isSmallMobile ? '16px' : '18px',
                  color: '#9ca3af',
                  textDecoration: 'line-through'
                }}>₹{product.oldPrice}</span>
              )}

              {product.oldPrice && (
                <span style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: isSmallMobile ? '12px' : '14px',
                  fontWeight: '600'
                }}>
                  {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setActiveTab('description')}
                style={{
                  padding: isSmallMobile ? '8px 12px' : '10px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'description' ? '2px solid #4f46e5' : 'none',
                  color: activeTab === 'description' ? '#4f46e5' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: isSmallMobile ? '14px' : '15px'
                }}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  padding: isSmallMobile ? '8px 12px' : '10px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'reviews' ? '2px solid #4f46e5' : 'none',
                  color: activeTab === 'reviews' ? '#4f46e5' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: isSmallMobile ? '14px' : '15px'
                }}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'description' ? (
              <div style={{
                marginBottom: '24px',
                lineHeight: '1.6',
                color: '#4b5563',
                fontSize: isSmallMobile ? '14px' : '16px'
              }}>
                {product.description || 'No description available.'}
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                {reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reviews.map(review => (
                      <div key={review.id} style={{
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <FiUser color="#6b7280" size={14} />
                            </div>
                            <span style={{
                              fontWeight: '600',
                              fontSize: isSmallMobile ? '14px' : '15px'
                            }}>{review.user}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div style={{
                          color: '#6b7280',
                          fontSize: isSmallMobile ? '12px' : '13px',
                          marginBottom: '6px'
                        }}>
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                        <p style={{
                          lineHeight: '1.5',
                          margin: 0,
                          fontSize: isSmallMobile ? '14px' : '15px'
                        }}>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '16px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: isSmallMobile ? '14px' : '16px'
                  }}>
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{
              marginBottom: '24px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151',
                fontSize: isSmallMobile ? '14px' : '16px'
              }}>Quantity:</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: isSmallMobile ? '32px' : '36px',
                    height: isSmallMobile ? '32px' : '36px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ':hover': {
                      background: '#f3f4f6'
                    },
                    ':disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  -
                </button>
                <span style={{
                  width: '50px',
                  textAlign: 'center',
                  fontSize: isSmallMobile ? '15px' : '16px',
                  fontWeight: '600'
                }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  style={{
                    width: isSmallMobile ? '32px' : '36px',
                    height: isSmallMobile ? '32px' : '36px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ':hover': {
                      background: '#f3f4f6'
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isInCart}
              whileTap={!isInCart ? { scale: 0.95 } : {}}
              style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '300px',
                padding: isSmallMobile ? '12px' : '14px',
                borderRadius: '8px',
                border: 'none',
                background: isInCart ? '#10b981' : '#4f46e5',
                color: 'white',
                fontWeight: '600',
                cursor: isInCart ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: isSmallMobile ? '15px' : '16px',
                marginBottom: '20px'
              }}
            >
              <FiShoppingCart size={isSmallMobile ? 16 : 18} />
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: isSmallMobile ? '18px' : '20px',
              fontWeight: '600',
              color: '#1f2937'
            }}>You may also like</h2>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: isSmallMobile ? '14px' : '16px'
            }}>
              View all <FiChevronRight size={isSmallMobile ? 14 : 16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmallMobile ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            <AnimatePresence>
              {relatedProducts.map((rp) => (
                <motion.div
                  key={rp._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleProductClick(rp._id)}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    ':hover': {
                      boxShadow: '0 8px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <div style={{
                    height: isSmallMobile ? '180px' : isMobile ? '160px' : '180px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={`${API_URL.replace('/api/', '')}${rp.imageUrl}`}
                      alt={rp.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{
                    padding: isSmallMobile ? '12px' : '14px'
                  }}>
                    <h3 style={{
                      fontSize: isSmallMobile ? '14px' : '15px',
                      fontWeight: '600',
                      margin: '0 0 6px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{rp.name}</h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        fontSize: isSmallMobile ? '15px' : '16px',
                        fontWeight: '700',
                        color: '#4f46e5'
                      }}>₹{rp.price}</span>
                      {rp.oldPrice && (
                        <span style={{
                          fontSize: isSmallMobile ? '13px' : '14px',
                          color: '#9ca3af',
                          textDecoration: 'line-through'
                        }}>₹{rp.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;