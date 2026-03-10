const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getPosts)
    .post(protect, authorize('author', 'admin'), createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, authorize('author', 'admin'), updatePost)
    .delete(protect, authorize('author', 'admin'), deletePost);

module.exports = router;
