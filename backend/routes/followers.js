const express = require('express');
const Follower = require('../models/Follower');
const auth = require('../middleware/auth');

const router = express.Router();

// Follow a user
router.post('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    if (followerId === userId) return res.status(400).json({ msg: 'Cannot follow yourself' });

    let follower = await Follower.findOne({ follower_id: followerId, following_id: userId });
    if (follower) return res.status(400).json({ msg: 'Already following' });

    follower = new Follower({
      follower_id: followerId,
      following_id: userId
    });

    await follower.save();
    res.json(follower);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unfollow a user
router.delete('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    const follower = await Follower.findOneAndDelete({ follower_id: followerId, following_id: userId });
    if (!follower) return res.status(404).json({ msg: 'Follow not found' });

    res.json({ msg: 'Unfollowed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get followers of a user
router.get('/followers/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await Follower.find({ following_id: userId }).populate('follower_id', 'username full_name avatar_url').sort({ created_at: -1 });
    res.json(followers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get users a user is following
router.get('/following/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await Follower.find({ follower_id: userId }).populate('following_id', 'username full_name avatar_url').sort({ created_at: -1 });
    res.json(following);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
