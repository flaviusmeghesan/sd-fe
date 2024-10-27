import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, Button } from 'reactstrap';
import logo from './commons/images/icon.png';

const textStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px',
};

const NavigationBar = ({ user, onLogout }) => (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand>
                <NavLink to="/" style={textStyle}>
                    <img src={logo} width={"50"} height={"35"} alt="Logo" />
                </NavLink>
            </NavbarBrand>
            <Nav className="mr-auto" navbar>
                <NavLink to="/" style={textStyle}>Home</NavLink>
                {user && (user.role === 'Admin' || user.role === 'admin') && (
                    <NavLink to="/admin" style={textStyle}>Admin Dashboard</NavLink>
                )}
                {user && (user.role === 'Client' || user.role === 'client') && (
                    <NavLink to="/client" style={textStyle}>Client Dashboard</NavLink>
                )}
            </Nav>
            <Nav className="ml-auto" navbar>
                {user ? (
                    <Button color="secondary" onClick={onLogout}>Logout</Button>
                ) : (
                    <NavLink to="/login" style={textStyle}>Login</NavLink>
                )}
            </Nav>
        </Navbar>
    </div>
);

export default NavigationBar;
