import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../Axios/axiosInstance";
import { FiShoppingBag, FiArrowLeft, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import styled from "styled-components";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userData");

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(`/cart/addToCart?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data.data);
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

    try {
      await API.post(
        "/api/cart",
        { productId, quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/remove?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
    }
  };

  // Calculate order summary
  const taxRate = 0.05;
  const shippingRate = 10;
  const subtotal = cart.reduce(
    (acc, item) =>
      item.productId ? acc + item.productId.price * item.quantity : acc,
    0
  );
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? shippingRate : 0;
  const total = subtotal + tax + shipping;

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
        <h1>
          <FiShoppingBag /> Your Shopping Cart
        </h1>
        <Link to="/ProductsPage">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </Header>

      <ContentLayout>
       <CartItems>
          {cart.length === 0 ? (
            <EmptyCart>
              <img src="/empty-cart.svg" alt="Empty cart" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <Link to="/ProductsPage" className="cta-button">
                Browse Products
              </Link>
            </EmptyCart>
          ) : (
            cart.map(
              (item) =>
                item.productId && (
                  <CartItem key={item._id}>
                    <ProductImage
                      src={`http://localhost:5001${item.productId.imageUrl}`}
                      alt={item.productId.name}
                    />
                    <ProductDetails>
                      <h4>{item.productId.name}</h4>
                      <div className="mobile-row">
                        <p className="category">{item.productId.category}</p>
                        <p className="price-mobile">₹{item.productId.price.toFixed(2)} each</p>
                      </div>
                      <p className="price-desktop">₹{item.productId.price.toFixed(2)} each</p>
                    </ProductDetails>
                    <QuantityWrapper>
                      <QuantityControls>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </QuantityControls>
                      <Subtotal>
                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                      </Subtotal>
                    </QuantityWrapper>
                    <RemoveButton onClick={() => removeItem(item.productId._id)} aria-label="Remove item">
                      <FiTrash2 />
                    </RemoveButton>
                  </CartItem>
                )
            )
          )}
        </CartItems>
        {cart.length > 0 && (
          <OrderSummary>
            <SummaryCard>
              <h3>Order Summary</h3>
              <SummaryRow>
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </SummaryRow>
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
                  }))
                }}
              >
                Proceed to Checkout
              </CheckoutButton>
            </SummaryCard>
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
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (min-width: 768px) {
      font-size: 1.8rem;
    }
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4a5568;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }

    &:hover {
      color: #2d3748;
    }
  }
`;

const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const CartItems = styled.div`
  flex: 2;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  text-align: center;

  img {
    width: 150px;
    height: auto;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      width: 200px;
      margin-bottom: 1.5rem;
    }
  }

  h3 {
    font-size: 1.25rem;
    color: #2d3748;
    margin-bottom: 0.5rem;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    color: #718096;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }

  .cta-button {
    background: #4299e1;
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    &:hover {
      background: #3182ce;
    }
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  grid-template-areas:
    "image details remove"
    "image quantity quantity";
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #edf2f7;
  position: relative;

  @media (min-width: 640px) {
    grid-template-columns: 100px 2fr 1fr auto;
    grid-template-areas: "image details quantity remove";
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    grid-template-columns: 100px 2fr 1fr 1fr auto;
    grid-template-areas: "image details quantity subtotal remove";
  }
`;

const ProductImage = styled.img`
  grid-area: image;
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;

  @media (min-width: 768px) {
    height: 100px;
  }
`;

const ProductDetails = styled.div`
  grid-area: details;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.1rem;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }
  }

  .category {
    font-size: 0.8rem;
    color: #718096;
    margin-bottom: 0.25rem;

    @media (min-width: 768px) {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
  }

  .price-desktop {
    display: none;
    font-size: 0.875rem;
    color: #4a5568;

    @media (min-width: 768px) {
      display: block;
    }
  }

  .price-mobile {
    font-size: 0.8rem;
    color: #4a5568;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .mobile-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    @media (min-width: 768px) {
      display: block;
    }
  }
`;

const QuantityWrapper = styled.div`
  grid-area: quantity;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 1.5rem;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    width: 32px;
    height: 32px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4a5568;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f7fafc;
      border-color: #cbd5e0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      width: 28px;
      height: 28px;
    }
  }

  span {
    min-width: 30px;
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      min-width: 36px;
      font-size: 1rem;
    }
  }
`;

const Subtotal = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
  text-align: right;

  @media (max-width: 767px) {
    text-align: left;
  }

  @media (min-width: 768px) {
    grid-area: subtotal;
    text-align: right;
    font-size: 1rem;
  }
`;

const RemoveButton = styled.button`
  grid-area: remove;
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  padding: 0.5rem;

  &:hover {
    color: #c53030;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const OrderSummary = styled.div`
  flex: 1;

  @media (min-width: 1024px) {
    position: sticky;
    top: 1rem;
    align-self: flex-start;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.25rem;

    @media (min-width: 768px) {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;

  @media (min-width: 768px) {
    font-size: 0.9375rem;
    margin-bottom: 0.75rem;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.25rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d3748;

  @media (min-width: 768px) {
    font-size: 1.125rem;
    margin: 1.5rem 0;
  }
`;

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.7rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;

  @media (min-width: 768px) {
    padding: 0.75rem;
    font-size: 1rem;
  }

  &:hover {
    background: #3182ce;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
  color: #4a5568;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(66, 153, 225, 0.2);
  border-radius: 50%;
  border-top-color: #4299e1;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;