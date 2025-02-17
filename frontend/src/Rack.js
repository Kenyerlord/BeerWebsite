import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Import the Modal component
import notAvailableImage from './assets/notavailable.webp';

const Rack = ({ cart, setCart, removeFromRack }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const totalPrice = cart.reduce((total, item) => total + (item.beer.Price || 0) * item.quantity, 0);

  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      handleRemoveFromRack(index);
    }
  };

  const handleRemoveFromRack = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    removeFromRack(index);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      console.log('Loaded cart from local storage:', parsedCart);
      setCart(parsedCart);
    }
  }, [setCart]);

  const handlePlaceOrder = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If the user is not logged in, show the modal
      setIsModalOpen(true);
    } else {
      // User is logged in, navigate to the Checkout page
      navigate('/checkout');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>This is the Rack (aka the Cart)</h1>
      {cart.length === 0 ? (
        <p>Your rack is empty.</p>
      ) : (
        <div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
  {cart.map((item, index) => (
    <li key={index} style={{ 
      margin: '10px 0', 
      border: '1px solid #ccc', 
      padding: '10px', 
      borderRadius: '5px', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={`/image/${item.beer.Name}.png`}
          alt={item.beer.Name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = notAvailableImage;
          }}
          style={{ width: '50px', height: 'auto', borderRadius: '5px', marginRight: '10px' }} // Adjusted width and added margin
        />
        <span style={{ fontSize: '18px' }}> {/* Increased font size here */}
          {item.beer.Name} - {item.beer.Price ? item.beer.Price.toFixed(2) : 'N/A'}$ 
          <span> (Quantity: {item.quantity})</span>
        </span>
      </div>
      <div style={{ marginLeft: 'auto' }}> {/* This will push the buttons to the right */}
        <button 
          onClick={() => increaseQuantity(index)} 
          style={{ 
            marginLeft: '10px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '5px 10px' 
          }}
        >
          +
        </button>
        <button 
          onClick={() => decreaseQuantity(index)} 
          style={{ 
            marginLeft: '5px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '5px 10px' 
          }}
        >
          -
        </button>
        <button 
          onClick={() => handleRemoveFromRack(index)} 
          style={{ 
            marginLeft: '10px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '5px 10px' 
          }}
        >
          Remove
        </button>
      </div>
    </li>
  ))}
</ul>
          <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
          <button 
            onClick={handlePlaceOrder} 
            style={{ marginTop: '20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px' }}
          >
            Place Order
          </button>
        </div>
      )}
      {isModalOpen && (
        <Modal 
          message="This action requires you to log in or sign up." 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Rack;