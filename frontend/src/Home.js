import React, { useState, useEffect } from 'react';

const images = require.context('../public/image', false, /\.(png|jpe?g|svg)$/);

const Home = () => {
  const imagePaths = images.keys().map(images);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    }, 5000); 

    return () => clearInterval(interval); 
  }, [imagePaths.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagePaths.length) % imagePaths.length);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <h1>Welcome to Lager Legends!</h1>
        <p>We are glad to have you here. Explore our wide range of craft beers and enjoy your stay!</p>
      </div>
      <div style={{ flex: 1, position: 'relative', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imagePaths[currentImageIndex]}
            alt={`Beer ${currentImageIndex + 1}`}
            style={{ width: '512px', height: '512px' }} 
          />
          <button onClick={prevImage} style={buttonStyle('left')}>{"<"}</button>
          <button onClick={nextImage} style={buttonStyle('right')}>{">"}</button>
          <p>*The Image is just an Illustration and not representitive of the product*</p>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = (position) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)', 
  border: 'none',
  borderRadius: '5px',
  padding: '10px',
  cursor: 'pointer',
  zIndex: 1,
  ...(position === 'left' ? { left: '10px' } : { right: '10px' }),
});

export default Home;