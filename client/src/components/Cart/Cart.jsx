import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiArrowLeft, FiTrash2, FiPlus, FiMinus, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userData");
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}cart/addToCart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCart(prevCart => 
        prevCart.map(item => 
          item.productId._id === productId 
            ? { ...item, quantity: newQty } 
            : item
        )
      );
      toast.success("Quantity updated");
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      fetchCart();
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      await axios.delete(`${API_URL}cart/remove?productId=${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setCart(prevCart => prevCart.filter(item => item.productId._id !== productId));
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      fetchCart();
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const applyCoupon = () => {
    // In a real app, you would validate the coupon with your backend
    if (couponCode === "SAVE10") {
      setDiscount(0.1); // 10% discount
      setCouponApplied(true);
      toast.success("Coupon applied! 10% discount");
    } else if (couponCode) {
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  // Calculate order summary
  const taxRate = 0.05;
  const shippingRate = 10;
  const subtotal = cart.reduce(
    (acc, item) => (item.productId ? acc + item.productId.price * item.quantity : acc),
    0
  );
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? shippingRate : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal + tax + shipping - discountAmount;

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
        <p>Loading your cart...</p>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <div className="header-content">
          <h1>
            <FiShoppingBag /> Your Shopping Cart
          </h1>
          <p className="item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>
        <Link to="/ProductsPage" className="continue-shopping">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </Header>

      <ContentLayout>
        <CartItems>
          {cart.length === 0 ? (
            <EmptyCart>
              <div className="empty-cart-icon">
                <FiShoppingBag size={48} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <Link to="/ProductsPage" className="cta-button">
                Browse Products
              </Link>
            </EmptyCart>
          ) : (
            <AnimatePresence>
              {cart.map((item) =>
                item.productId && (
                  <CartItem
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    disabled={updatingItems[item.productId._id]}
                  >
                    <ProductImage
                      src={`${API_URL.replace('/api/', '')}${item.productId.imageUrl}`}
                      alt={item.productId.name}
                      onClick={() => navigate(`/product/${item.productId._id}`)}
                    />
                    <ProductDetails>
                      <h4 onClick={() => navigate(`/product/${item.productId._id}`)}>
                        {item.productId.name}
                      </h4>
                      <p className="category">{item.productId.category}</p>
                      <p className="price">₹{item.productId.price.toFixed(2)} each</p>
                    </ProductDetails>
                    <QuantityWrapper>
                      <QuantityControls>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems[item.productId._id]}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          disabled={updatingItems[item.productId._id]}
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </QuantityControls>
                    </QuantityWrapper>
                    <Subtotal>
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </Subtotal>
                    <RemoveButton 
                      onClick={() => removeItem(item.productId._id)} 
                      aria-label="Remove item"
                      disabled={updatingItems[item.productId._id]}
                    >
                      <FiTrash2 />
                    </RemoveButton>
                  </CartItem>
                )
              )}
            </AnimatePresence>
          )}
        </CartItems>
        
        {cart.length > 0 && (
          <OrderSummary>
            <SummaryCard>
              <h3>Order Summary</h3>
              
              <CouponSection>
                {couponApplied ? (
                  <div className="coupon-applied">
                    <span>Coupon: {couponCode} (10% off)</span>
                    <button onClick={removeCoupon}><FiX /></button>
                  </div>
                ) : (
                  <div className="coupon-input">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button onClick={applyCoupon}>Apply</button>
                  </div>
                )}
              </CouponSection>
              
              <SummaryRow>
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </SummaryRow>
              
              {discount > 0 && (
                <SummaryRow className="discount">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </SummaryRow>
              )}
              
              <SummaryRow>
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </SummaryRow>
              
              <SummaryRow>
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </SummaryRow>
              
              <Divider />
              
              <TotalRow>
                <strong>Total</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </TotalRow>
              
              <CheckoutButton
                to="/CheckoutPage"
                state={{
                  cartItems: cart.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                  })),
                  discount: discountAmount
                }}
              >
                Proceed to Checkout
              </CheckoutButton>
              
              <SecureCheckout>
                <div className="secure-icon">🔒</div>
                <span>Secure Checkout</span>
              </SecureCheckout>
              
              <PaymentMethods>
                <img src="https://e7.pngegg.com/pngimages/242/982/png-clipart-visa-logo-credit-card-e-commerce-visa-payment-mastercard-visa-company-text.png" alt="Visa" />
                <img src="https://www.logo.wine/a/logo/PhonePe/PhonePe-Logo.wine.svg" alt="Phone pe" />
                <img src="https://www.logo.wine/a/logo/PayPal/PayPal-Logo.wine.svg" alt="PayPal" />
                <img src="https://www.logo.wine/a/logo/Apple_Pay/Apple_Pay-Logo.wine.svg" alt="Apple Pay" />
              </PaymentMethods>
            </SummaryCard>
            
            {/* <Recommendations>
              <h4>Frequently Bought Together</h4>
              <div className="products">
                
                <div className="product">
                  <img src="/product1.jpg" alt="Product" />
                  <p>Wireless Earbuds</p>
                  <button>Add to Cart</button>
                </div>
                <div className="product">
                  <img src="/product2.jpg" alt="Product" />
                  <p>Phone Case</p>
                  <button>Add to Cart</button>
                </div>
              </div>
            </Recommendations> */}
          </OrderSummary>
        )}
      </ContentLayout>
    </Container>
  );
};

export default Cart;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  @media (min-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;

    svg {
      color: #4f46e5;
    }
  }

  .item-count {
    background: #f3f4f6;
    color: #6b7280;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
  }

  .continue-shopping {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    font-size: 1rem;
    width: fit-content;

    &:hover {
      color: #4338ca;
      text-decoration: underline;
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 3rem;
    align-items: flex-start;
  }
`;

const CartItems = styled.div`
  flex: 2;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;

  .empty-cart-icon {
    background: #f0f9ff;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    color: #3b82f6;
  }

  h3 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  p {
    color: #6b7280;
    margin-bottom: 2rem;
    font-size: 1rem;
    max-width: 350px;
    line-height: 1.5;
  }

  .cta-button {
    background: #4f46e5;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(79, 70, 229, 0.2);

    &:hover {
      background: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
    }
  }
`;

const CartItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    grid-template-columns: 100px 2fr 1fr 1fr auto;
    gap: 2rem;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.03);
  }

  @media (min-width: 768px) {
    height: 100px;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #4f46e5;
    }
  }

  .category {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .price {
    font-size: 0.875rem;
    color: #4f46e5;
    font-weight: 500;
  }
`;

const QuantityWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.25rem;
  background: #f9fafb;

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4b5563;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: #f3f4f6;
      color: #1f2937;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    min-width: 30px;
    text-align: center;
    font-weight: 500;
    font-size: 0.95rem;
  }
`;

const Subtotal = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  text-align: right;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0.5rem;
  border-radius: 6px;

  &:hover:not(:disabled) {
    background: #fee2e2;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const OrderSummary = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    position: sticky;
    top: 1rem;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }
`;

const CouponSection = styled.div`
  margin-bottom: 1.5rem;

  .coupon-input {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
      }
    }

    button {
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #4338ca;
      }
    }
  }

  .coupon-applied {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f0fdf4;
    color: #166534;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;

    button {
      background: none;
      border: none;
      color: #166534;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.25rem;
      border-radius: 4px;

      &:hover {
        background: #dcfce7;
      }
    }
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  color: #4b5563;

  &.discount {
    color: #166534;
    font-weight: 500;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
`;

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 5px rgba(79, 70, 229, 0.2);

  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
  }
`;

const SecureCheckout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;

  .secure-icon {
    font-size: 1rem;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;

  img {
    height: 24px;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.2s;

    &:hover {
      filter: grayscale(0%);
      opacity: 1;
    }
  }
`;

const Recommendations = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .products {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .product {
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    p {
      font-size: 0.875rem;
      color: #1f2937;
      margin: 0;
    }

    button {
      background: #f3f4f6;
      color: #1f2937;
      border: none;
      border-radius: 6px;
      padding: 0.5rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e5e7eb;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1.5rem;
  color: #4b5563;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: ${spin} 1s ease-in-out infinite;
`;