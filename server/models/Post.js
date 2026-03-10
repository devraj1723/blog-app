const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        trim: true
    }],
    coverImage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Add index for search
postSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
