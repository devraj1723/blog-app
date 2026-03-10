import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const fetchPostAndComments = async () => {
        try {
            setLoading(true);
            const [postRes, commentsRes] = await Promise.all([
                api.get(`/posts/${id}`),
                api.get(`/comments/post/${id}`)
            ]);

            setPost(postRes.data);
            setComments(commentsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Post not found or server error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const response = await api.post(`/comments/post/${id}`, { text: comment });
                setComments([response.data, ...comments]);
                setComment('');
            } catch (err) {
                console.error('Error adding comment:', err);
                alert('Please log in to comment');
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                navigate('/');
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('Failed to delete post. Not authorized.');
            }
        }
    };

    // Check if user is author for local UI changes 
    const isAuthor = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr || !post) return false;
        try {
            const user = JSON.parse(userStr);
            return user._id === post.author._id || user.role === 'admin';
        } catch (e) {
            return false;
        }
    };

    if (loading) {
        return <div className="post-detail-container"><h2 style={{ textAlign: 'center', marginTop: '4rem' }}>Loading article...</h2></div>;
    }

    if (error || !post) {
        return <div className="post-detail-container"><h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#ff4b4b' }}>{error}</h2></div>;
    }

    // Format date properly
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="post-detail-container">
            <article className="post-article">
                <header className="post-header">
                    <span className="post-category">{post.category}</span>
                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-author-meta">
                        <div className="author-avatar">{post.author?.username?.charAt(0).toUpperCase() || 'U'}</div>
                        <div className="author-info">
                            <span className="author-name">{post.author?.username || 'Unknown Author'}</span>
                            <span className="post-date">{formatDate(post.createdAt)} • {post.views} views</span>
                        </div>
                    </div>
                </header>

                {post.coverImage && (
                    <div className="post-hero-image">
                        <img src={post.coverImage} alt={post.title} />
                    </div>
                )}

                <div className="post-content">
                    {/* Basic rendering of text content handling newlines */}
                    {post.content.split('\n').map((paragraph, index) => (
                        paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                    ))}
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                        {post.tags.map((tag, idx) => (
                            <span key={idx} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="post-actions">
                    <div className="interaction-buttons">
                        <button className="icon-btn like-btn">
                            <span className="icon">♥</span> {post.likes?.length || 0}
                        </button>
                        <button className="icon-btn comment-btn">
                            <span className="icon">💬</span> {comments.length}
                        </button>
                    </div>
                    <div className="share-buttons" style={{ display: 'flex', gap: '1rem' }}>
                        {isAuthor() && (
                            <button onClick={handleDelete} className="icon-btn" style={{ color: '#ff4b4b' }}>Delete Post</button>
                        )}
                        <button className="icon-btn share-btn">Share</button>
                    </div>
                </div>
            </article>

            <section className="comments-section">
                <h3>Comments ({comments.length})</h3>

                <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea
                        placeholder="What are your thoughts?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="3"
                    ></textarea>
                    <div className="comment-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={!comment.trim()}>
                            Post Comment
                        </button>
                    </div>
                </form>

                <div className="comments-list">
                    {comments.map((c) => (
                        <div key={c._id} className="comment-item">
                            <div className="comment-avatar">{c.author?.username?.charAt(0).toUpperCase() || 'U'}</div>
                            <div className="comment-body">
                                <div className="comment-meta">
                                    <span className="comment-author">{c.author?.username || 'Unknown'}</span>
                                    <span className="comment-date">{formatDate(c.createdAt)}</span>
                                </div>
                                <p className="comment-text">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
