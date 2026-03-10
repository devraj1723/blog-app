const express = require('express');
const router = express.Router();
const {
    getPostComments,
    addComment,
    deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.route('/post/:postId')
    .get(getPostComments)
    .post(protect, addComment);

router.route('/:id')
    .delete(protect, deleteComment);

module.exports = router;
