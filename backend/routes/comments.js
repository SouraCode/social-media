const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const pipeline = [
      { $match: { post_id: new mongoose.Types.ObjectId(postId) } },
      {
        $lookup: {
          from: 'profiles',
          localField: 'user_id',
          foreignField: '_id',
          as: 'profiles'
        }
      },
      { $unwind: '$profiles' },
      {
        $project: {
          _id: 0,
          id: '$_id',
          user_id: 1,
          post_id: 1,
          content: 1,
          created_at: 1,
          profiles: 1
        }
      },
      { $sort: { created_at: 1 } }
    ];
    const comments = await Comment.aggregate(pipeline);
    res.json(comments);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add comment
router.post('/:postId', auth, async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    const comment = new Comment({
      user_id: req.user.id,
      post_id: postId,
      content
    });

    await comment.save();
    await comment.populate('user_id', 'username full_name avatar_url');
    res.json(comment);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (comment.user_id.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    const { content } = req.body;
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (comment.user_id.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    await comment.remove();
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
