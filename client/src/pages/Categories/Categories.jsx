import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
    // Dummy categories data
    const categories = [
        { name: 'Technology', count: 42, icon: '💻', description: 'Latest in software, hardware, and tech trends.' },
        { name: 'Design', count: 28, icon: '🎨', description: 'UI/UX, graphic design, and modern web aesthetics.' },
        { name: 'Lifestyle', count: 15, icon: '🌿', description: 'Health, productivity, and everyday living.' },
        { name: 'Programming', count: 84, icon: '⌨️', description: 'Code tutorials, framework deep-dives, and best practices.' },
        { name: 'Business', count: 31, icon: '📈', description: 'Startups, entrepreneurship, and market analysis.' },
        { name: 'Science', count: 12, icon: '🔬', description: 'Discoveries, space exploration, and physics.' }
    ];

    return (
        <div className="categories-container">
            <div className="categories-header">
                <h1>Explore Categories</h1>
                <p>Find articles tailored to your specific interests</p>
            </div>

            <div className="categories-grid">
                {categories.map((category, index) => (
                    <Link to={`/?category=${category.name.toLowerCase()}`} key={index} className="category-card">
                        <div className="category-icon">{category.icon}</div>
                        <h2 className="category-name">{category.name}</h2>
                        <p className="category-desc">{category.description}</p>
                        <span className="category-count">{category.count} Articles</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
