import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from './logo.png';
import Racklogo from './rack.png';

function Menu({ user, handleLogout, cart }) { 
    const imageStyle = { width: "60px", height: "40px" };
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <Navbar expand="lg" className="bg-dark-custom">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src={Logo} style={imageStyle} alt="Logo" />
                    Lager Legends
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/catalog">Catalog</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {user ? (
                            <NavDropdown title={user.name} id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/userprofile">User  Profile</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/purchase-history">Purchase History</NavDropdown.Item> 
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/logout" onClick={handleLogout}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
                            </>
                        )}
                        <Nav.Link as={Link} to="/rack" style={{ position: 'relative' }}>
                            <img src={Racklogo} style={imageStyle} alt="Rack Logo" />
                            {cartItemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    right: '0px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 6px',
                                    fontSize: '12px',
                                    transform: 'translate(50%, 50%)',
                                }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menu;