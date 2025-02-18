import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import Success from './Success'; // Import the Success component

const Checkout = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingInfo, setShippingInfo] = useState({
        mobile: '',
        country: '',
        city: '',
        street: '',
        house: '',
        creditCard: '',
        expirationDate: '',
        cvv: '',
        cardholderName: '',
        paymentMethod: 'Visa', // Default payment method
        deliveryMethod: 'normal' // Default delivery method
    });
    const [successVisible, setSuccessVisible] = useState(false); // State for success message visibility

    // Function to get user ID from token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        const decoded = jwtDecode(token);
        return decoded.id; // Ensure the token contains the user ID
    };

    // Fetch user profile information from API endpoint
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = getUserIdFromToken();
                if (!userId) return;

                const response = await axios.get(`http://localhost:8080/termek/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data) {
                    setShippingInfo(prevInfo => ({
                        ...prevInfo,
                        mobile: response.data.mobile,
                        country: response.data.countryaddress,
                        city: response.data.cityaddress,
                        street: response.data.streetaddress,
                        house: response.data.houseaddress
                    }));
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Calculate total price
    useEffect(() => {
        const basePrice = cart.reduce((total, item) => total + (item.beer.Price || 0) * item.quantity, 0);
        let deliveryFee = 0;

        if (shippingInfo.deliveryMethod === 'express') {
            deliveryFee = basePrice * 0.25; // 25% fee
        } else if (shippingInfo.deliveryMethod === 'normal') {
            deliveryFee = basePrice * 0.10; // 10% fee
        }

        setTotalPrice(basePrice + deliveryFee);
    }, [cart, shippingInfo.deliveryMethod]);

    // Redirect to home if the cart is empty and success is not visible
    useEffect(() => {
        if (cart.length === 0 && !successVisible) {
            navigate('/'); // Redirect to home only if the cart is empty and success is not visible
        }
    }, [cart, navigate, successVisible]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleDeliveryChange = (e) => {
        const { value } = e.target;
        setShippingInfo(prevInfo => ({
            ...prevInfo,
            deliveryMethod: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userId = getUserIdFromToken(); // Get the user ID from the token
        if (!userId) return; // If no user ID, do not proceed
    
        try {
            // Send the order details to the backend
            const response = await axios.post('http://localhost:8080/termek/order', {
                cart,
                buyerId: userId // Include the buyer ID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.data.success) {
                console.log('Order placed:', {
                    cart,
                    totalPrice,
                    shippingInfo,
                });
                // Clear the cart after placing the order
                setCart([]);
                // Show the success message
                setSuccessVisible(true);
            } else {
                console.error('Error placing order:', response.data.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Checkout</h1>
            {successVisible && ( // Render the Success component if visible
                <Success onClose={() => setSuccessVisible(false)} />
            )}
            {cart.length === 0 ? (
                <p style={styles.emptyCart}>Your cart is empty.</p>
            ) : (
                <div>
                    <h2 style={styles.subHeader}>Your Items</h2>
                    <ul style={styles.itemList}>
                        {cart.map((item, index) => (
                            <li key={index} style={styles.item}>
                                {item.beer.Name} - {item.beer.Price ? item.beer.Price.toFixed(2) : 'N/A'}$ 
                                <span> (Quantity: {item.quantity})</span>
                            </li>
                        ))}
                    </ul>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <h3 style={styles.sectionHeader}>Shipping Information</h3>
                        <input 
                            type="text" 
                            name="mobile" 
                            placeholder="Mobile" 
                            value={shippingInfo.mobile} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="country" 
                            placeholder="Country" 
                            value={shippingInfo.country} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="city" 
                            placeholder="City" 
                            value={shippingInfo.city} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="street" 
                            placeholder="Street" 
                            value={shippingInfo.street} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="house" 
                            placeholder="House" 
                            value={shippingInfo.house} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <h3 style={styles.sectionHeader}>Payment Information</h3>
                        <select 
                            name="paymentMethod" 
                            value={shippingInfo.paymentMethod} 
                            onChange={handleChange} 
                            style={styles.select}
                        >
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                            <option value="PayPal">PayPal</option>
                        </select>
                        <input 
                            type="text" 
                            name="creditCard" 
                            placeholder="Card Number" 
                            value={shippingInfo.creditCard} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="expirationDate" 
                            placeholder="Expiration Date (MM/YY)" 
                            value={shippingInfo.expirationDate} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="cvv" 
                            placeholder="CVV" 
                            value={shippingInfo.cvv} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <input 
                            type="text" 
                            name="cardholderName" 
                            placeholder="Cardholder Name" 
                            value={shippingInfo.cardholderName} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        <h3 style={styles.sectionHeader}>Delivery Method</h3>
                        <label style={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="express" 
                                checked={shippingInfo.deliveryMethod === 'express'} 
                                onChange={handleDeliveryChange} 
                            />
                            Express Delivery (+25%)(Approx.:2-3 business days)
                        </label>
                        <label style={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="normal" 
                                checked={shippingInfo.deliveryMethod === 'normal'} 
                                onChange={handleDeliveryChange} 
                            />
                            Normal Delivery (+10%)(Approx.:7-10 business days)
                        </label>
                        <label style={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="noFee" 
                                checked={shippingInfo.deliveryMethod === 'noFee'} 
                                onChange={handleDeliveryChange} 
                            />
                            We Get There When We Get There (no fee)(Approx.: 2-4 weeks)
                        </label>
                        <h2 style={styles.totalPrice}>Total Price: ${totalPrice.toFixed(2)}</h2>
                        <button type="submit" style={styles.button}>Place Order</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles = {
  container: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#363636', // Set background to grey
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '20px auto',
  },
  header: {
      fontSize: '2rem',
      color: '#000', // Set text color to black
      marginBottom: '20px',
      color:"white",
  },
  emptyCart: {
      fontSize: '1.2rem',
      color: '#000', // Set text color to black
  },
  subHeader: {
      fontSize: '1.5rem',
      color: '#000', // Set text color to black
      marginBottom: '15px',
      color:"white",
  },
  itemList: {
      listStyleType: 'none',
      padding: 0,
  },
  item: {
      margin: '10px 0',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#fff',
      color: "black",
  },
  totalPrice: {
      fontSize: '1.5rem',
      color: '#28a745',
      margin: '20px 0',
  },
  form: {
      marginTop: '20px',
  },
  sectionHeader: {
      fontSize: '1.3rem',
      color: '#000', // Set text color to black
      marginBottom: '15px',
      color:"white",
  },
  input: {
      display: 'block',
      margin: '10px auto',
      padding: '10px',
      width: '80%',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '1rem',
  },
  select: {
      display: 'block',
      margin: '10px auto',
      padding: '10px',
      width: '80%',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '1rem',
  },
  radioLabel: {
      display: 'block',
      margin: '10px auto',
      fontSize: '1rem',
      color:"white",
  },
  button: {
      marginTop: '20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      fontSize: '1rem',
      cursor: 'pointer',
  },
};

export default Checkout;