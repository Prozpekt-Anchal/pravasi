const Comment = require('../models/Comment');

async function getCommentsByTripAndDay(req, res) {
  try {
    const { tripId, day } = req.params;

    const comments = await Comment.find({ trip: tripId, day }).sort({
      createdAt: 1
    });

    return res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch comments'
    });
  }
}

async function createComment(req, res) {
  try {
    const { tripId, day } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    const comment = await Comment.create({
      trip: tripId,
      day,
      text,
      author: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to create comment'
    });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to delete comment'
    });
  }
}

module.exports = {
  getCommentsByTripAndDay,
  createComment,
  deleteComment
};

