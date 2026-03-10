import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    Chronicle
                </Link>
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/categories" className="nav-link">Categories</Link>
                    <Link to="/create-post" className="nav-link">Write</Link>
                    <Link to="/about" className="nav-link">About</Link>
                </nav>
                <div className="auth-buttons">
                    {token ? (
                        <>
                            <span className="nav-link" style={{ cursor: 'default', alignSelf: 'center' }}>
                                Hello, {user?.username || 'User'}
                            </span>
                            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Log In</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
