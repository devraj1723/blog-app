const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const { category, search, author } = req.query;
        let query = { status: 'published' };

        // Build query based on filters
        if (category) query.category = category;
        if (author) query.author = author;

        // Search functionality using text index
        if (search) {
            query.$text = { $search: search };
        }

        const posts = await Post.find(query)
            .populate('author', 'username profilePic')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profilePic');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Author/Admin)
exports.createPost = async (req, res) => {
    try {
        const { title, content, category, tags, coverImage, status } = req.body;

        const post = new Post({
            title,
            content,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            coverImage,
            status: status || 'published',
            author: req.user._id
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Author/Admin)
exports.updatePost = async (req, res) => {
    try {
        const { title, content, category, tags, coverImage, status } = req.body;

        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user authorization
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
        post.coverImage = coverImage || post.coverImage;
        post.status = status || post.status;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author/Admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user authorization
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
