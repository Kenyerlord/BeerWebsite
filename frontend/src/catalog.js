import React, { useEffect, useState, useRef } from 'react';
import BeerCard from './BeerCard';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const [filteredBeers, setFilteredBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedCountry, setSelectedCountry] = useState(undefined);
  const [selectedBVolume, setselectedBVolume] = useState(undefined);
  const [selectedBType, setselectedBType] = useState(undefined);
  const [alcoholRange, setAlcoholRange] = useState([1, 7]);
  const [priceRange, setPriceRange] = useState([3.09, 9.99]);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE); 

  const location = useLocation();
  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('searchTerm') || '');
    setSelectedType(params.get('selectedType') || undefined);
    setSelectedCountry(params.get('selectedCountry') || undefined);
    setselectedBVolume(params.get('selectedBVolume') || undefined);
    setselectedBType(params.get('selectedBType') || undefined);
    setAlcoholRange([
      Number(params.get('alcoholMin')) || 1,
      Number(params.get('alcoholMax')) || 7,
    ]);
    setPriceRange([
      Number(params.get('priceMin')) || 3.09,
      Number(params.get('priceMax')) || 9.99,
    ]);
  }, [location.search]);


  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        const data = response.data;
        setBeers(data);
      } catch (error) {
        console.error('Error fetching beers:', error);
      }
    };

    fetchBeers();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const newFilteredBeers = beers.filter((beer) => {
        const matchesSearchTerm = beer.Name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType ? beer.Type.toString() === selectedType : true;
        const matchesCountry = selectedCountry ? beer.CountryofOrigin.toString() === selectedCountry : true;
        const matchesBVolume = selectedBVolume ? beer.BottleVolume.toString() === selectedBVolume : true;
        const matchesBType = selectedBType ? beer.BottleType.toString() === selectedBType : true;
        const matchesAlcoholLevel = beer.AlcoholLevel >= (alcoholRange[0] || 0) && beer.AlcoholLevel <= (alcoholRange[1] || Infinity);
        const matchesPrice = beer.Price >= (priceRange[0] || 0) && beer.Price <= (priceRange[1] || Infinity);

        return matchesSearchTerm && matchesType && matchesCountry && matchesBVolume && matchesBType && matchesAlcoholLevel && matchesPrice;
      });

      setFilteredBeers(newFilteredBeers);
      window.scrollTo(0, 0); 
    };

    applyFilters();
  }, [beers, searchTerm, selectedType, selectedCountry, selectedBVolume, selectedBType, alcoholRange, priceRange]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchTerm', searchTerm);
    if (selectedType) params.set('selectedType', selectedType);
    if (selectedCountry) params.set('selectedCountry', selectedCountry);
    if (selectedBVolume) params.set('selectedBVolume', selectedBVolume);
    if (selectedBType) params.set('selectedBType', selectedBType);
    params.set('alcoholMin', alcoholRange[0]);
    params.set('alcoholMax', alcoholRange[1]);
    params.set('priceMin', priceRange[0]);
    params.set('priceMax', priceRange[1]);

    navigate({ search: params.toString() });
  }, [searchTerm, selectedType, selectedCountry, selectedBVolume, selectedBType, alcoholRange, priceRange, navigate]);

  const displayedBeers = filteredBeers.slice(0, displayCount); 

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(undefined);
    setSelectedCountry(undefined);
    setselectedBVolume(undefined);
    setselectedBType(undefined);
    setAlcoholRange([1, 7]);
    setPriceRange([3.09, 9.99]);
    setDisplayCount(ITEMS_PER_PAGE); 
    window.scrollTo(0, 0); 
  };
  const loadMoreBeers = () => {
    setDisplayCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };
  useEffect(() => {
    const lastBeerElement = document.querySelector('#last-beer');
    if (!lastBeerElement) return;

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        loadMoreBeers();
      }
    };

    observer.current = new IntersectionObserver(observerCallback);
    observer.current.observe(lastBeerElement);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [displayedBeers]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flex: '0 0 250px',
            marginRight: '20px',
            textAlign: 'left',
            backgroundColor: '#363636',
            padding: '20px',
            borderRadius: '5px',
            position: 'fixed', 
            top: '80px',
            left: '20px',
            height: 'calc(100vh - 100px)', 
            overflowY: 'auto', 
            maxHeight: '600px', 
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search for a beer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={clearFilters}
              style={{
                padding: '10px 15px',
                backgroundColor: '#d9534f',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                width: '100%',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c9302c')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d9534f')}
            >
              Clear Filters
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <select
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType || ''}
              style={{
                display: 'block',
                marginBottom: '10px',
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            >
              <option value="">All Types</option>
              {Object.entries(beerTypeMapping).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setSelectedCountry(e.target.value)}
              value={selectedCountry || ''}
              style={{
                display: 'block',
                marginBottom: '10px',
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            >
              <option value="">All Countries</option>
              {Object.entries(COOMapping).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setselectedBVolume(e.target.value)}
              value={selectedBVolume || ''}
              style={{
                display: 'block',
                marginBottom: '10px',
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            >
              <option value="">All Volumes</option>
              {Object.entries(BVMapping).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setselectedBType(e.target.value)}
              value={selectedBType || ''}
              style={{
                display: 'block',
                marginBottom: '10px',
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            >
              <option value="">All BottleTypes</option>
              {Object.entries(BTMapping).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Alcohol Level:</label>
              <Slider
                range
                min={1}
                max={7}
                value={alcoholRange}
                onChange={setAlcoholRange}
                railStyle={{ backgroundColor: '#ccc' }}
                trackStyle={[{ backgroundColor: '#007bff' }]}
                handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span>Min: {alcoholRange[0]}%</span>
                <span>Max: {alcoholRange[1]}%</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Price:</label>
              <Slider
                range
                min={3.09}
                max={9.99}
                step={0.01}
                value={priceRange}
                onChange={setPriceRange}
                railStyle={{ backgroundColor: '#ccc' }}
                trackStyle={[{ backgroundColor: '#007bff' }]}
                handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span>Min: ${priceRange[0] !== undefined ? priceRange[0].toFixed(2) : 'N/A'}</span>
                <span>Max: ${priceRange[1] !== undefined ? priceRange[1].toFixed(2) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: '1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginLeft: '270px' }}>
          {displayedBeers.map((beer, index) => (
            <BeerCard key={beer.Name} beer={beer} addToRack={addToRack} />
          ))}
          {displayedBeers.length > 0 && <div id="last-beer" style={{ height: '20px' }} />}
        </div>
      </div>
    </div>
  );
};

export default Catalog;