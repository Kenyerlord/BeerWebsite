import React, { useEffect, useState } from 'react';
import BeerCard from './BeerCard'; 
import axios from 'axios';

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

const ITEMS_PER_PAGE = 20;

const Catalog = ({ addToRack }) => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedBVolume, setselectedBVolume] = useState('');
  const [selectedBType, setselectedBType] = useState('');
  const [minAlcoholLevel, setMinAlcoholLevel] = useState(1);
  const [maxAlcoholLevel, setMaxAlcoholLevel] = useState(7);
  const [minPrice, setMinPrice] = useState(3.09);
  const [maxPrice, setMaxPrice] = useState(9.99);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        const data = response.data;
        console.log('catalog', data);
        setBeers(data);
      } catch (error) {
        console.error('Error fetching beers:', error);
      }
    };

    fetchBeers();
  }, []);

  const filteredBeers = beers.filter(beer => {
    const matchesSearchTerm = beer.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? beer.Type.toString() === selectedType : true;
    const matchesCountry = selectedCountry ? beer.CountryofOrigin.toString() === selectedCountry : true; 
    const matchesBVolume = selectedBVolume ? beer.BottleVolume.toString() === selectedBVolume : true; 
    const matchesBType = selectedBType ? beer.BottleType.toString() === selectedBType : true; 
    const matchesAlcoholLevel = beer.AlcoholLevel >= minAlcoholLevel && beer.AlcoholLevel <= maxAlcoholLevel;
    const matchesPrice = beer.Price >= minPrice && beer.Price <= maxPrice;
  
    return matchesSearchTerm && matchesType && matchesCountry && matchesBVolume && matchesBType && matchesAlcoholLevel && matchesPrice;
  });

  const totalPages = Math.ceil(filteredBeers.length / ITEMS_PER_PAGE);

  const displayedBeers = filteredBeers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search for a beer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ 
          flex: '0 0 250px', 
          marginRight: '20px', 
          textAlign: 'left', 
          backgroundColor: '#363636', 
          padding: '20px', 
          borderRadius: '5px' 
        }}>
          <div style={{ marginBottom: '20px' }}>
  <select 
    onChange={(e) => setSelectedType(e.target.value)} 
    value={selectedType} 
    style={{ 
      display: 'block', 
      marginBottom: '10px', 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '5px', 
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s'
    }} 
    onFocus={(e) => e.target.style.borderColor = '#007bff'}
    onBlur={(e) => e.target.style.borderColor = '#ccc'}
  >
    <option value="">All Types</option>
    {Object.entries(beerTypeMapping).map(([key, value]) => (
      <option key={key} value={key}>{value}</option>
    ))}
  </select>

  <select 
    onChange={(e) => setSelectedCountry(e.target.value)} 
    value={selectedCountry} 
    style={{ 
      display: 'block', 
      marginBottom: '10px', 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '5px', 
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s'
    }} 
    onFocus={(e) => e.target.style.borderColor = '#007bff'}
    onBlur={(e) => e.target.style.borderColor = '#ccc'}
  >
    <option value="">All Countries</option>
    {Object.entries(COOMapping).map(([key, value]) => (
      <option key={key} value={key}>{value}</option>
    ))}
  </select>

  <select 
    onChange={(e) => setselectedBVolume(e.target.value)} 
    value={selectedBVolume} 
    style={{ 
      display: 'block', 
      marginBottom: '10px', 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '5px', 
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s'
    }} 
    onFocus={(e) => e.target.style.borderColor = '#007bff'}
    onBlur={(e) => e.target.style.borderColor = '#ccc'}
  >
    <option value="">All Volumes</option>
    {Object.entries(BVMapping).map(([key, value]) => (
      <option key={key} value={key}>{value}</option>
    ))}
  </select>

  <select 
    onChange={(e) => setselectedBType(e.target.value)} 
    value={selectedBType} 
    style={{ 
      display: 'block', 
      marginBottom: '10px', 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '5px', 
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s'
    }} 
    onFocus={(e) => e.target.style.borderColor = '#007bff'}
    onBlur={(e) => e.target.style.borderColor = '#ccc'}
  >
    <option value="">All BottleTypes</option>
    {Object.entries(BTMapping).map(([key, value]) => (
      <option key={key} value={key}>{value}</option>
    ))}
  </select>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Alcohol Level: {minAlcoholLevel}% - {maxAlcoholLevel}%</label>
              <input
                type="range"
                min="1"
                max="7"
                value={minAlcoholLevel}
                style={{ width: '100%' }} 
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  setMinAlcoholLevel(newMin);
                  if (newMin > maxAlcoholLevel) {
                    setMaxAlcoholLevel(newMin);
                  }
                }}
              />
              <input
                type="range"
                min="1"
                max="7"
                value={maxAlcoholLevel}
                style={{ width: '100%' }} 
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  setMaxAlcoholLevel(newMax);
                  if (newMax < minAlcoholLevel) {
                    setMinAlcoholLevel(newMax); 
                  }
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Price: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</label>
              <input
                type="range"
                min="3.09"
                max="9.99"
                step="0.01"
                value={minPrice}
                style={{ width: '100%' }}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  setMinPrice(newMin);
                  if (newMin > maxPrice) {
                    setMaxPrice(newMin);
                  }
                }}
              />
              <input
                type="range"
                min="3.09"
                max="9.99"
                step="0.01"
                value={maxPrice}
                style={{ width: '100%' }}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  setMaxPrice(newMax);
                  if (newMax < minPrice) {
                    setMinPrice(newMax);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ flex: '1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {displayedBeers.map((beer) => (
          <BeerCard key={beer.Name} beer={beer} addToRack={addToRack} />
        ))}
      </div>
      </div>

      <div style={{ marginTop: '20px' }}>
  <button 
    onClick={() => setCurrentPage(1)} 
    disabled={currentPage === 1}
    style={{ 
      padding: '10px 15px', 
      margin: '0 5px', 
      backgroundColor: currentPage === 1 ? '#ccc' : '#001487', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#050969'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#001487'}
  >
    First
  </button>
  <button 
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
    disabled={currentPage === 1}
    style={{ 
      padding: '10px 15px', 
      margin: '0 5px', 
      backgroundColor: currentPage === 1 ? '#ccc' : '#001487', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#050969'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#001487'}
  >
    Previous
  </button>
  <span style={{ margin: '0 10px' }}>
    Page {currentPage} of {totalPages}
  </span>
  <button 
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
    disabled={currentPage === totalPages}
    style={{ 
      padding: '10px 15px', 
      margin: '0 5px', 
      backgroundColor: currentPage === totalPages ? '#ccc' : '#001487', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#050969'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#001487'}
  >
    Next
  </button>
  <button 
    onClick={() => setCurrentPage(totalPages)} 
    disabled={currentPage === totalPages}
    style={{ 
      padding: '10px 15px', 
      margin: '0 5px', 
      backgroundColor: currentPage === totalPages ? '#ccc' : '#001487', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#050969'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#001487'}
  >
    Last
  </button>
</div>
    </div>
  );
};
export default Catalog;