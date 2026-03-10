import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import './Home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const url = category ? `/posts?category=${category}` : '/posts';
                const response = await api.get(url);
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category]);

    // Format date properly
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to <span className="highlight">Chronicle</span></h1>
                    <p className="hero-subtitle">Discover stories, thinking, and expertise from writers on any topic.</p>
                    <div className="search-bar">
                        <input type="text" placeholder="Search for articles, topics, or authors..." className="search-input" />
                        <button className="search-btn">Search</button>
                    </div>
                </div>
            </section>

            <div className="content-layout">
                <div className="main-feed">
                    <h2 className="section-title">Featured Posts</h2>
                    <div className="post-grid">
                        {loading && <h3 style={{ gridColumn: '1 / -1', textAlign: 'center', margin: '2rem 0' }}>Loading posts...</h3>}

                        {!loading && posts.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', margin: '2rem 0', padding: '3rem', background: 'var(--surface-color)', borderRadius: '16px' }}>
                                <h3>No posts found {category ? `in ${category}` : 'yet'}</h3>
                                <p style={{ color: '#a0a0a0', marginTop: '1rem' }}>Be the first to create one!</p>
                                <Link to="/create-post" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>Write a Post</Link>
                            </div>
                        )}

                        {posts.map(post => (
                            <Link to={`/post/${post._id}`} key={post._id} className="post-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                {post.coverImage && (
                                    <div className="post-image">
                                        <img src={post.coverImage} alt={post.title} />
                                    </div>
                                )}
                                <div className="post-content">
                                    <span className="post-category">{post.category}</span>
                                    <h3 className="post-title">{post.title}</h3>
                                    <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                                    <div className="post-meta">
                                        <span className="author">{post.author?.username || 'Unknown'}</span>
                                        <span className="date">{formatDate(post.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <aside className="sidebar">
                    <div className="widget">
                        <h3 className="widget-title">Popular Categories</h3>
                        <ul className="category-list">
                            <li>Technology <span className="count">42</span></li>
                            <li>Design <span className="count">28</span></li>
                            <li>Lifestyle <span className="count">15</span></li>
                            <li>Programming <span className="count">84</span></li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
