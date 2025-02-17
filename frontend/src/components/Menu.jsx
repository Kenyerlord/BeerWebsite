import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from './logo.png';
import Racklogo from './rack.png';

function Menu({ user, handleLogout }) { // Accept user and handleLogout as props
    const imageStyle = { width: "60px", height: "40px" };

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
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/catalog">Catalog</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {user ? (
                            <NavDropdown title={user.name} id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/userprofile">User  Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/logout" onClick={handleLogout}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
                            </>
                        )}
                        <Nav.Link as={Link} to="/rack">
                            <img src={Racklogo} style={imageStyle} alt="Rack Logo" />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menu;