import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import filmImage from './assets/background.webp';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Home from './Home';
import Catalog from './catalog';
import SignUp from './signup';
import LogIn from './Login';
import UserProfile from './UserProfile';
import BeerInfo from './beerinfo';
import Rack from './Rack';
import Checkout from './Checkout'; // Import the Checkout component
import { jwtDecode } from 'jwt-decode';

function App() {
    const [showModel, setShowModel] = useState(false);
    const [cart, setCart] = useState([]);
    const [user, setUser  ] = useState(null); // State for the logged-in user
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the token to get user info
                setUser  ({ name: decoded.name }); // Set the user state with the decoded name
            } catch (error) {
                console.error('Token decoding failed:', error);
                // Optionally handle token expiration or invalid token
            }
        }
    }, []);

    const handleOpenModel = () => {
        setShowModel(true);
        navigate("/login");
    };

    const handleCloseModel = () => {
        setShowModel(false);
        navigate("/");
    };

    const addToRack = (beer) => {
        setCart((prevCart) => {
            const existingBeer = prevCart.find(item => item.beer.Name === beer.Name);
            let updatedCart;
            if (existingBeer) {
                updatedCart = prevCart.map(item => 
                    item.beer.Name === beer.Name ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = [...prevCart, { beer, quantity: 1 }];
            }
            
            // Save the updated cart to local storage
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem('token'); // Remove the token from local storage
        setUser  (null); // Clear the user state
        navigate('/'); // Navigate to the home page
    };

    const removeFromRack = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    const appStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh' };
    const mainStyle = { backgroundImage: `url(${filmImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', flex: '1', padding: '20px', color: 'white' };

    return (
        <div style={appStyle}>
            <Menu user={user} handleLogout={handleLogout} /> {/* Pass user state and handleLogout to Menu */}
            <main style={mainStyle}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog addToRack={addToRack} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<LogIn setUser  ={setUser  } />} /> {/* Pass setUser   to LogIn */}
                    <Route path="/userprofile" element={<UserProfile user={user} />} />
                    <Route path="/beer/:name" element={<BeerInfo addToRack={addToRack} />} />
                    <Route path="/rack" element={<Rack cart={cart} setCart={setCart} removeFromRack={removeFromRack} />} />
                    <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} /> {/* Add the Checkout route */}
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;