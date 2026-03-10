import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Editor.css';

const CreatePost = () => {
    const [postData, setPostData] = useState({
        title: '',
        category: '',
        tags: '',
        image: null,
        content: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [previewUrl, setPreviewUrl] = useState('');

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostData({ ...postData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Note: If handling actual images in the future, we would use FormData
            // Since our backend doesn't have Multer setup for file uploads right now,
            // we will just send the title, category, tags, and content

            const postObj = {
                title: postData.title,
                content: postData.content,
                category: postData.category || 'technology',
                tags: postData.tags,
                coverImage: previewUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800' // Default if no image logic implemented on backend
            };

            const response = await api.post('/posts', postObj);
            console.log('Post created:', response.data);
            navigate(`/post/${response.data._id}`); // Redirect to the newly created post

        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please make sure you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h2>Create New Post</h2>
                {error && <div className="auth-error editor-error">{error}</div>}
                <div className="editor-actions">
                    <button className="btn btn-outline" type="button">Save Draft</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <form className="editor-form" onSubmit={handleSubmit}>
                <div className="main-editor">
                    <input
                        type="text"
                        name="title"
                        className="title-input"
                        placeholder="Post Title..."
                        value={postData.title}
                        onChange={handleChange}
                        required
                    />

                    <div className="image-upload-container">
                        {previewUrl ? (
                            <div className="image-preview">
                                <img src={previewUrl} alt="Preview" />
                                <button type="button" className="remove-image" onClick={() => {
                                    setPreviewUrl('');
                                    setPostData({ ...postData, image: null });
                                }}>✕</button>
                            </div>
                        ) : (
                            <label className="image-upload-label">
                                <div className="upload-placeholder">
                                    <span className="upload-icon">📷</span>
                                    <p>Click to add a cover image</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden-input"
                                />
                            </label>
                        )}
                    </div>

                    <textarea
                        name="content"
                        className="content-input"
                        placeholder="Write your story here... (Markdown supported)"
                        value={postData.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="side-editor">
                    <div className="settings-panel">
                        <h3>Post Settings</h3>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={postData.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                <option value="technology">Technology</option>
                                <option value="design">Design</option>
                                <option value="lifestyle">Lifestyle</option>
                                <option value="programming">Programming</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                placeholder="e.g. react, nodejs, tutorial"
                                value={postData.tags}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="publish-info">
                            <p><strong>Author:</strong> You</p>
                            <p><strong>Visibility:</strong> Public</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
