const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username profilePic')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a comment
// @route   POST /api/comments/post/:postId
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            text,
            author: req.user._id,
            post: req.params.postId
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'username profilePic');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check user authorization (comment author, post author, or admin)
        const post = await Post.findById(comment.post);

        if (
            comment.author.toString() !== req.user._id.toString() &&
            post.author.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
