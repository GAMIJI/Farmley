import React, { useEffect, useState } from 'react';
import './ProductDetail.css';
import { useNavigate } from 'react-router-dom';
import API from '../../Axios/axiosInstance';

const ProductDetail = () => {
  const [clickedItems, setClickedItems] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProduct] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const product_id = localStorage.getItem('productid');

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!product_id || product_id === 'undefined') {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }

    const fetchProductDetail = async () => {
      try {
        const response = await API.get(`/products/${product_id}`);
        setProduct(response.data);

        const category = response.data.category;
        if (!category) throw new Error('Product category is undefined or missing');

        const relatedResponse = await API.get(`/products?category=${category}`);
        const filtered = relatedResponse.data.filter(
          (p) => p._id.toString().trim() !== product_id.toString().trim()
        );
        setRelatedProduct(filtered);
      } catch (error) {
        setError('Failed to load product details.');
        console.error('Product detail fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [product_id]);

  const handleCart = (_id) => {
    if (!_id || cartItems.some((item) => item._id === _id)) return;

    setClickedItems((prev) => ({ ...prev, [_id]: true }));

    setTimeout(() => {
      const updatedCart = [...cartItems, { _id, quantity }];
      setCartItems(updatedCart);
      setClickedItems((prev) => ({ ...prev, [_id]: false }));
    }, 1500);
  };

  const handleProductClick = (id) => {
    localStorage.setItem('productid', id);
    navigate('/productdetail');
  };

  if (loading) return <div className="text-center mt-4">Loading product details...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <img
            src={product.imageUrl ? `http://farmley-backend-1.onrender.com${product.imageUrl}` : '/default-image.jpg'}
            alt={product.name}
            className="img-fluid rounded mb-3 product-image"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <div className="mb-3">
            <span className="h4 me-2">₹{product.price}</span>
            {product.oldPrice && <span className="text-muted"><s>₹{product.oldPrice}</s></span>}
          </div>

          <p className="mb-4">
            {product.description?.substring(0, 500) || 'No description available.'}
          </p>

          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">Quantity:</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '80px' }}
            />
          </div>

          <button
            style={{ width: '50%', marginRight: '10px' }}
            className={`cart-button ${clickedItems[product._id] ? 'clicked' : ''}`}
            onClick={() => handleCart(product._id)}
            disabled={cartItems.some((item) => item._id === product._id)}
          >
            <span className="add-to-cart">
              {cartItems.some((item) => item._id === product._id) ? '' : 'Add to Cart'}
            </span>
            <span className="added">
              {cartItems.some((item) => item._id === product._id) ? 'Added' : ''}
            </span>
            <i className="fas fa-shopping-cart"></i>
            <i className="fas fa-box"></i>
          </button>
        </div>
      </div>

      <div className="mt-5">
        {relatedProducts.length > 0 && (
          <>
            <h4 className="mb-3">Related Products</h4>
            <div className="d-flex flex-wrap gap-3">
              {relatedProducts.slice(0, 6).map((rp) => (
                <div
                  key={rp._id}
                  className="related-card shadow-sm p-2 rounded text-center"
                  style={{
                    minWidth: '160px',
                    flex: '0 0 auto',
                    border: '1px solid #eee',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleProductClick(rp._id)}
                >
                  <img
                    src={rp.imageUrl ? `http://farmley-backend-1.onrender.com${rp.imageUrl}` : '/default-image.jpg'}
                    className="related-img mb-2"
                    alt={rp.name}
                    style={{
                      height: '100px',
                      width: '100%',
                      objectFit: 'contain',
                    }}
                  />
                  <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                    {rp.name.length > 20 ? `${rp.name.slice(0, 20)}...` : rp.name}
                  </h6>
                  <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                    ₹{rp.price}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
