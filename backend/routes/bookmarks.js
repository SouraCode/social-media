const express = require('express');
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

const router = express.Router();

// Bookmark a post
router.post('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    let bookmark = await Bookmark.findOne({ user_id: userId, post_id: postId });
    if (bookmark) return res.status(400).json({ msg: 'Already bookmarked' });

    bookmark = new Bookmark({
      user_id: userId,
      post_id: postId
    });

    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unbookmark a post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOneAndDelete({ user_id: userId, post_id: postId });
    if (!bookmark) return res.status(404).json({ msg: 'Bookmark not found' });

    res.json({ msg: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user_id: req.user.id }).populate({
      path: 'post_id',
      populate: { path: 'user_id', select: 'username full_name avatar_url' }
    }).sort({ created_at: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
