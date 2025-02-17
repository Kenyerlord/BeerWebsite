import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Modal = ({ message, onClose }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGoToLogin = () => {
    navigate('/login'); // Navigate to the login page
    onClose(); // Close the modal
  };

  const handleGoToSignUp = () => {
    navigate('/signup'); // Navigate to the sign-up page
    onClose(); // Close the modal
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Notification</h2>
        <p>{message}</p>
        <div>
          <button onClick={handleGoToLogin} style={modalStyles.button}>Go to Login</button>
          <button onClick={handleGoToSignUp} style={{ ...modalStyles.button, marginLeft: '10px' }}>Go to Sign Up</button>
        </div>
        <button onClick={onClose} style={{ ...modalStyles.closeButton, marginTop: '10px' }}>Close</button>
      </div>
    </div>
  );
};

const modalStyles = {
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
  modal: {
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
  },
  closeButton: {
    backgroundColor: '#dc3545', // Red color for the close button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
  },
};

export default Modal;