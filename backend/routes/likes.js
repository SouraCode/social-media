const express = require('express');
const mongoose = require('mongoose');
const Like = require('../models/Like');
const auth = require('../middleware/auth');

const router = express.Router();

// Like a post
router.post('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ msg: 'Invalid post ID' });
    }

    // Check if already liked
    let like = await Like.findOne({ user_id: userId, post_id: postId });
    if (like) return res.status(400).json({ msg: 'Already liked' });

    like = new Like({
      user_id: userId,
      post_id: postId
    });

    await like.save();
    res.json(like);
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unlike a post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOneAndDelete({ user_id: userId, post_id: postId });
    if (!like) return res.status(404).json({ msg: 'Like not found' });

    res.json({ msg: 'Like removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get likes for a post
router.get('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post_id: postId }).populate('user_id', 'username full_name avatar_url');
    res.json(likes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
