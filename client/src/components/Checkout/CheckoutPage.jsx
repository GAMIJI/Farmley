import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaShoppingCart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineUser } from 'react-icons/hi';
import API from '../../Axios/axiosInstance';
import '../Checkout/CheckoutPage.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rawItems = location.state?.cartItems || [];
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'cod',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    
    const [errors, setErrors] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productDetails = await Promise.all(
                    rawItems.map(async (item) => {
                        const res = await axios.get(`${API_URL}products/${item.productId}`);
                        return {
                            ...res.data,
                            quantity: item.quantity,
                        };
                    })
                );
                setCartItems(productDetails);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        if (rawItems.length > 0) {
            fetchProductDetails();
        } else {
            navigate('/cart');
        }
    }, [rawItems, navigate]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        
        if (formData.paymentMethod === 'online') {
            if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
            if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
            if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08;
        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: (subtotal + shipping + tax).toFixed(2)
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: rawItems,
                totals: calculateTotal(),
                status: 'pending'
            };

            const response = await axios.post(`${API_URL}order/checkout`, orderData);

            if (response.data.success) {
                setOrderDetails(response.data.order);
                setOrderSuccess(true);
            } else {
                alert('Order failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (activeStep === 1 && !validatePersonalInfo()) return;
        setActiveStep(prev => prev + 1);
    };

    const prevStep = () => {
        setActiveStep(prev => prev - 1);
    };

    const validatePersonalInfo = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { subtotal, shipping, tax, total } = calculateTotal();

    if (orderSuccess) {
        return (
            <div className="checkout-success">
                <div className="success-card">
                    <div className="success-icon-container">
                        <FaCheckCircle className="success-icon" />
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p className="success-message">Thank you for your purchase. A confirmation has been sent to {formData.email}.</p>
                    
                    <div className="order-details-card">
                        <div className="order-detail">
                            <span className="detail-label">Order Number</span>
                            <span className="detail-value">#{orderDetails?.orderId || Math.floor(Math.random() * 1000000)}</span>
                        </div>
                        <div className="order-detail">
                            <span className="detail-label">Total Amount</span>
                            <span className="detail-value">${total}</span>
                        </div>
                        <div className="order-detail">
                            <span className="detail-label">Estimated Delivery</span>
                            <span className="detail-value">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="success-actions">
                        <Link to="/orders" className="btn btn-outline">
                            View Order
                        </Link>
                        <Link to="/" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`checkout-container ${isMobile ? 'mobile' : 'desktop'}`}>
            {isMobile && (
                <div className="mobile-header">
                    <button onClick={activeStep > 1 ? prevStep : () => navigate(-1)} className="back-button">
                        <FaArrowLeft />
                    </button>
                    <h1>Checkout</h1>
                </div>
            )}
            
            {!isMobile && (
                <div className="checkout-header">
                    <h1>Complete Your Purchase</h1>
                    <div className="checkout-progress">
                        <div className={`progress-step ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}>
                            <div className="step-number">1</div>
                            <div className="step-title">Information</div>
                        </div>
                        <div className={`progress-step ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}>
                            <div className="step-number">2</div>
                            <div className="step-title">Shipping</div>
                        </div>
                        <div className={`progress-step ${activeStep === 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <div className="step-title">Payment</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="checkout-content">
                {!isMobile && (
                    <div className="order-summary-panel">
                        <h3><FaShoppingCart /> Order Summary</h3>
                        
                        <div className="cart-items-container">
                            {cartItems.map(item => (
                                <div key={item._id} className="cart-item">
                                    <div className="item-image-container">
                                        <img 
                                            src={`${API_URL.replace('/api/', '')}${item.imageUrl}`} 
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/80';
                                            }}
                                        />
                                        <span className="item-quantity-badge">{item.quantity}</span>
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>${item.price.toFixed(2)} × {item.quantity}</p>
                                    </div>
                                    <div className="item-total">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="order-totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span>{shipping === '0.00' ? 'FREE' : `$${shipping}`}</span>
                            </div>
                            <div className="total-row">
                                <span>Tax</span>
                                <span>${tax}</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="checkout-form-panel">
                    {activeStep === 1 && (
                        <div className="form-section">
                            <div className="section-header">
                                {isMobile && <div className="step-indicator">Step 1 of 3</div>}
                                <h2><HiOutlineUser /> Personal Information</h2>
                            </div>
                            
                            <div className="form-group">
                                <label>Email Address*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name*</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        className={errors.firstName ? 'error' : ''}
                                    />
                                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name*</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className={errors.lastName ? 'error' : ''}
                                    />
                                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Phone Number*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(123) 456-7890"
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" className="btn btn-next" onClick={nextStep}>
                                    {isMobile ? 'Continue' : 'Continue to Shipping'}
                                    {!isMobile && <FaArrowRight style={{marginLeft: '8px'}} />}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeStep === 2 && (
                        <div className="form-section">
                            <div className="section-header">
                                {isMobile && <div className="step-indicator">Step 2 of 3</div>}
                                <h2><HiOutlineLocationMarker /> Shipping Address</h2>
                            </div>
                            
                            <div className="form-group">
                                <label>Street Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main St"
                                    className={errors.address ? 'error' : ''}
                                />
                                {errors.address && <span className="error-message">{errors.address}</span>}
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="New York"
                                        className={errors.city ? 'error' : ''}
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>
                                <div className="form-group">
                                    <label>State*</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="NY"
                                        className={errors.state ? 'error' : ''}
                                    />
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>ZIP Code*</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="10001"
                                    className={errors.zipCode ? 'error' : ''}
                                />
                                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={prevStep}>
                                    <FaArrowLeft style={{marginRight: '8px'}} />
                                    Back
                                </button>
                                <button type="button" className="btn btn-next" onClick={nextStep}>
                                    {isMobile ? 'Continue' : 'Continue to Payment'}
                                    {!isMobile && <FaArrowRight style={{marginLeft: '8px'}} />}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeStep === 3 && (
                        <form onSubmit={handleSubmit} className="form-section">
                            <div className="section-header">
                                {isMobile && <div className="step-indicator">Step 3 of 3</div>}
                                <h2><HiOutlineCreditCard /> Payment Method</h2>
                            </div>
                            
                            <div className="payment-options">
                                <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                    />
                                    <div className="payment-content">
                                        <FaMoneyBillWave className="payment-icon" />
                                        <div className="payment-details">
                                            <span className="payment-title">Cash on Delivery</span>
                                            <span className="payment-description">Pay when you receive your order</span>
                                        </div>
                                    </div>
                                </label>
                                
                                <label className={`payment-option ${formData.paymentMethod === 'online' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={formData.paymentMethod === 'online'}
                                        onChange={handleChange}
                                    />
                                    <div className="payment-content">
                                        <FaCreditCard className="payment-icon" />
                                        <div className="payment-details">
                                            <span className="payment-title">Credit/Debit Card</span>
                                            <span className="payment-description">Secure online payment</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            
                            {formData.paymentMethod === 'online' && (
                                <div className="card-details-section">
                                    <div className="form-group">
                                        <label>Card Number*</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            placeholder="1234 5678 9012 3456"
                                            className={errors.cardNumber ? 'error' : ''}
                                        />
                                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry Date*</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                placeholder="MM/YY"
                                                className={errors.expiryDate ? 'error' : ''}
                                            />
                                            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>CVV*</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                placeholder="123"
                                                className={errors.cvv ? 'error' : ''}
                                            />
                                            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {isMobile && (
                                <div className="mobile-order-summary">
                                    <h4>Order Summary</h4>
                                    <div className="mobile-totals">
                                        <div className="total-row">
                                            <span>Subtotal</span>
                                            <span>${subtotal}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Shipping</span>
                                            <span>{shipping === '0.00' ? 'FREE' : `$${shipping}`}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Tax</span>
                                            <span>${tax}</span>
                                        </div>
                                        <div className="total-row grand-total">
                                            <span>Total</span>
                                            <span>${total}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={prevStep}>
                                    <FaArrowLeft style={{marginRight: '8px'}} />
                                    Back
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        `Pay $${total}`
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;