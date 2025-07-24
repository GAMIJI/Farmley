import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import API from '../../Axios/axiosInstance';

const CheckoutPage = () => {

    const location = useLocation();
   const rawItems = location.state?.cartItems || []; // [{productId, quantity}]
console.log("Cart items passed to checkout:", rawItems);


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

    const [cartItems, setCartItems] = useState([]);
    // console.log(cartItems);
    
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);


    // Fetch cart items (mock data)
 useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetails = await Promise.all(
          rawItems.map(async (item) => {
            const res = await API.get(`/products/${item.productId}`);
            return {
              ...res.data, // your API should return product { _id, name, price, imageUrl }
              quantity: item.quantity,
            };
          })
        );
        console.log("fhgiukjfdngf",productDetails);
        
        setCartItems(productDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (rawItems.length > 0) {
      fetchProductDetails();
    }
  }, [rawItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 5.99; // Flat rate shipping
        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            total: (subtotal + shipping).toFixed(2)
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: rawItems,
                total: calculateTotal().total,
                status: 'pending'
            };

            const response = await axios.post('http://localhost:5001/api/order/checkout', orderData);

            if (response.data.success) {
                setOrderSuccess(true);
            } else {
                alert('Order failed. Try again.');
            }

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const { subtotal, shipping, total } = calculateTotal();

    if (orderSuccess) {
        return (
            <div style={styles.successContainer}>
                <div style={styles.successCard}>
                    <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
                    <p style={styles.successText}>Thank you for your purchase. Your order has been received.</p>
                    <p style={styles.successText}>Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                    <Link
                        style={styles.continueButton}
                        to={'/'}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.checkoutContainer}>
                <h1 style={styles.title}>Checkout</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGrid}>
                        {/* Billing Information */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Billing Information</h2>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.grid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>City*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>State*</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>ZIP Code*</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Payment Method</h2>

                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        style={styles.radioInput}
                                    />
                                    Cash on Delivery (COD)
                                </label>

                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={formData.paymentMethod === 'online'}
                                        onChange={handleChange}
                                        style={styles.radioInput}
                                    />
                                    Online Payment
                                </label>
                            </div>

                            {formData.paymentMethod === 'online' && (
                                <>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Card Number*</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            required={formData.paymentMethod === 'online'}
                                            placeholder="1234 5678 9012 3456"
                                            style={styles.input}
                                        />
                                    </div>

                                    <div style={styles.grid}>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Expiry Date*</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                required={formData.paymentMethod === 'online'}
                                                placeholder="MM/YY"
                                                style={styles.input}
                                            />
                                        </div>

                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>CVV*</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                required={formData.paymentMethod === 'online'}
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Order Summary */}
                            <div style={styles.summary}>
                                <h3 style={styles.summaryTitle}>Order Summary</h3>

                                <div style={styles.itemsContainer}>
                                    {cartItems.map(item => (
                                        <div key={item.id} style={styles.itemRow}>
                                            <div style={styles.itemImageContainer}>
                                                <img
                                                    // src={`${API}/${item.image}`}
                                                      src={`http://localhost:5001${item.imageUrl}`}
                                                    alt={item.name}
                                                    style={styles.itemImage}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://examplefiles.org/img/example-image-files.svg'
                                                    }}
                                                />
                                            </div>
                                            <div style={styles.itemDetails}>
                                                <span style={styles.itemName}>{item.name}</span>
                                                <span style={styles.itemQuantity}>Qty: {item.quantity}</span>
                                            </div>
                                            <div style={styles.itemPrice}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.summaryRow}>
                                    <span>Subtotal:</span>
                                    <span>${subtotal}</span>
                                </div>

                                <div style={styles.summaryRow}>
                                    <span>Shipping:</span>
                                    <span>${shipping}</span>
                                </div>

                                <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                                    <span>Total:</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f8f9fa',
        padding: '20px',
        minHeight: '100vh'
    },
    checkoutContainer: {
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
        }
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    sectionTitle: {
        fontSize: '18px',
        color: '#34495e',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #ecf0f1',
        fontWeight: '500'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontSize: '14px',
        color: '#7f8c8d',
        fontWeight: '500'
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '15px',
        transition: 'border 0.3s',
        ':focus': {
            outline: 'none',
            borderColor: '#3498db',
            boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '15px'
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '15px',
        color: '#34495e',
        cursor: 'pointer'
    },
    radioInput: {
        margin: '0',
        width: '16px',
        height: '16px',
        cursor: 'pointer'
    },
    summary: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
    },
    summaryTitle: {
        fontSize: '16px',
        marginBottom: '15px',
        color: '#2c3e50'
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#7f8c8d',
        marginBottom: '8px'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        marginBottom: '8px'
    },
    totalRow: {
        fontWeight: 'bold',
        color: '#2c3e50',
        fontSize: '16px',
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid #ecf0f1'
    },
    submitButton: {
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '14px',
        fontSize: '16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.3s',
        marginTop: '20px',
        ':hover': {
            backgroundColor: '#2ecc71'
        },
        ':disabled': {
            backgroundColor: '#95a5a6',
            cursor: 'not-allowed'
        }
    },
    successContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px'
    },
    successCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
    },
    successTitle: {
        color: '#27ae60',
        fontSize: '24px',
        marginBottom: '20px'
    },
    successText: {
        color: '#7f8c8d',
        fontSize: '16px',
        marginBottom: '15px',
        lineHeight: '1.6'
    },
    continueButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.3s',
        marginTop: '20px',
        ':hover': {
            backgroundColor: '#2980b9'
        }
    },
    itemsContainer: {
        marginBottom: '15px',
        borderBottom: '1px solid #ecf0f1',
        paddingBottom: '15px'
    },
    itemRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        gap: '15px'
    },
    itemImageContainer: {
        width: '60px',
        height: '60px',
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa'
    },
    itemImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    itemDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    itemName: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#2c3e50'
    },
    itemQuantity: {
        fontSize: '12px',
        color: '#7f8c8d'
    },
    itemPrice: {
        fontWeight: '600',
        color: '#2c3e50'
    },

};

export default CheckoutPage;