const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes with error handling
try {
    app.use('/api/auth', require('./routes/auth'));
    console.log('Auth routes loaded');
} catch (err) {
    console.error('Error loading auth routes:', err);
}

try {
    app.use('/api/posts', require('./routes/posts'));
    console.log('Posts routes loaded');
} catch (err) {
    console.error('Error loading posts routes:', err);
}

try {
    app.use('/api/comments', require('./routes/comments'));
    console.log('Comments routes loaded');
} catch (err) {
    console.error('Error loading comments routes:', err);
}

app.get('/', (req, res) => {
    res.send('Blog API is running...');
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-app';
console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        process.exit(1);
    });
