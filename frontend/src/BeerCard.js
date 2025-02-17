import React from 'react';
import notAvailableImage from './assets/notavailable.webp';
import { Link } from 'react-router-dom';

const BeerCard = ({ beer, addToRack }) => {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '5px', 
      padding: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', // Ensure the card takes full height
      justifyContent: 'space-between', // Space between items
      backgroundColor: '#363636' // Set background color
    }}>
      <Link to={`/beer/${beer.Name}`} style={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
        <img
          src={`/image/${beer.Name}.png`}
          alt={beer.Name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = notAvailableImage;
          }}
          style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
        />
        <h3 style={{ color: 'white' }}>{beer.Name}</h3>
        <p style={{ color: 'white' }}>Price: {beer.Price ? beer.Price.toFixed(2) : 'N/A'}$</p>
      </Link>
      <button 
        onClick={() => addToRack(beer)} 
        style={{ 
          backgroundColor: '#001487', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          padding: '10px', 
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#050969'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#001487'}
        aria-label={`Add ${beer.Name} to rack`}
      >
        Add to Rack
      </button>
    </div>
  );
};

export default BeerCard;