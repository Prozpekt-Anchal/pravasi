const express = require('express');
const {
  getCommentsByTripAndDay,
  createComment,
  deleteComment
} = require('../controllers/comment.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.use(verifyToken);

router.get('/:tripId/:day', checkRole(['owner', 'editor', 'viewer'], 'tripId'), getCommentsByTripAndDay);
router.post('/:tripId/:day', checkRole(['owner', 'editor', 'viewer'], 'tripId'), createComment);
router.delete('/:id', deleteComment);

module.exports = router;

