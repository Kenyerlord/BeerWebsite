import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import notAvailableImage from './assets/notavailable.webp';
import 'bootstrap/dist/css/bootstrap.min.css';

const BeerInfo = ({ addToRack }) => {
  const { name } = useParams();
  const [beer, setBeer] = useState(null);
  const [error, setError] = useState(null);

  const beerTypeMapping = {
    1: 'IPA',
    2: 'Wheat Beer',
    3: 'Stout',
    4: 'Lager',
    5: 'Pilsner',
    6: 'Pale Ale',
    7: 'Brown Ale',
    8: 'Porter',
    9: 'Bock',
    10: 'Cream Ale',
    11: 'Blonde Ale',
    12: 'Bitter',
    13: 'Altbeer',
  };
  const COOMapping = {
    1: 'Germany',
    2: 'UK',
    3: 'Ireland',
    4: 'Czechia',
    5: 'Belgium',
    6: 'Austria',
  };
  const BVMapping = {
    1: '330ml',
    2: '500ml',
    3: '750ml',
    4: '1000ml',
    5: '1500ml',
    6: '2000ml',
  };
  const BTMapping = {
    1: 'Can',
    2: 'Glass',
    3: 'Bottle',
    4: 'Growler',
  };


  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/termek`);
        console.log('Fetched beer data:', response.data); 
        const fetchedBeer = response.data.find(b => b.Name === name); 
        console.log('Fetched beer:', fetchedBeer);
        setBeer(fetchedBeer);
      } catch (error) {
        console.error('Error fetching beer details:', error.response ? error.response.data : error.message);
      }
    };

    fetchBeer();
  }, [name]);

  if (error) {
    return <div>{error}</div>;
  }
  if (!beer) {
    return <div>Beer not found.</div>; 
  }
  console.log('Beer name from URL:', name);
  
  return (
    <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
        <div>
        <img
        src={`/image/${beer.Name}.png`}
        alt={beer.Name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = notAvailableImage;
        }}
        style={{ width: '500px', height: 'auto', borderRadius: '5px', marginRight: '20px' }} 
      />
      <p>*The Image is just an Illustration and not representitive of the product*</p>
        </div>
      
      <div>
        <h1 style={{fontSize:'3em'}}>{beer.Name}</h1>
        <p style={{fontSize:'2em'}}>Type: {beerTypeMapping[beer.Type] || 'Unknown'}</p>
        <p style={{fontSize:'2em'}}>Country of Origin: {COOMapping[beer.CountryofOrigin] || 'Unknown'}</p>
        <p style={{fontSize:'2em'}}>Alcohol Level: {beer.AlcoholLevel}%</p>
        <p style={{fontSize:'2em'}}>Bottle Volume: {BVMapping[beer.BottleVolume]}</p>
        <p style={{fontSize:'2em'}}>Bottle Type: {BTMapping[beer.BottleType]}</p>
        <p style={{fontSize:'2em'}}>Price: {beer.Price ? beer.Price.toFixed(2) : 'N/A'}$</p>

        

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
    </div>
    
  );
};

export default BeerInfo;