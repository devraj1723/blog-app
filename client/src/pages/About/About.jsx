import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About <span className="highlight">Chronicle</span></h1>
            </div>

            <div className="about-content">
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        Chronicle was built to provide a clean, noise-free environment for writers and readers.
                        We believe that great ideas deserve a modern, beautiful canvas. Our platform focuses on
                        typography, readability, and a seamless user experience.
                    </p>
                </div>

                <div className="about-section">
                    <h2>The Technology</h2>
                    <p>
                        This application is a full-stack project built with the **MERN** stack (MongoDB, Express, React, Node.js).
                        It features a completely custom frontend utilizing Vite for lightning-fast development, along with a
                        secure JSON Web Token (JWT) based authentication system on the backend.
                    </p>
                </div>

                <div className="about-section team-section">
                    <h2>Join the Community</h2>
                    <p>
                        Whether you're a seasoned software engineer, an aspiring designer, or just someone who loves sharing
                        their thoughts with the world, Chronicle is the place for you. Create an account today and start writing!
                    </p>
                    <div className="about-actions">
                        <a href="/signup" className="btn btn-primary">Sign Up Now</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
