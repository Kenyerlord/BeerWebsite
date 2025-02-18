// Success.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Success = ({ onClose }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackToHome = () => {
    navigate('/'); // Navigate to the home page
    onClose(); // Close the success message
  };

  return (
    <div style={successStyles.overlay}>
      <div style={successStyles.successMessage}>
        <h2>Order Placed Successfully</h2>
        <p>Thank you for your purchase!</p>
        <div>
          <button onClick={handleBackToHome} style={successStyles.button}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

const successStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#363636',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default Success;