const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsAbsolute = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsAbsolute)) {
      fs.mkdirSync(uploadsAbsolute, { recursive: true });
    }
    cb(null, uploadsAbsolute);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get posts feed
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const userIdFilter = req.query.userId ? new mongoose.Types.ObjectId(req.query.userId) : null;

    const UserId = new mongoose.Types.ObjectId(req.user.id);
    const pipeline = [];

    if (userIdFilter) {
      pipeline.push({ $match: { user_id: userIdFilter } });
    }

    pipeline.push(
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
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'bookmarks',
          let: { postId: '$_id', userId: UserId },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', '$$userId'] }] } } }
          ],
          as: 'user_bookmark'
        }
      },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id', userId: UserId },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', '$$userId'] }] } } }
          ],
          as: 'user_like'
        }
      },
      {
        $addFields: {
          likes_count: { $size: '$likes' },
          comments_count: { $size: '$comments' },
          is_liked: { $gt: [{ $size: '$user_like' }, 0] },
          is_bookmarked: { $gt: [{ $size: '$user_bookmark' }, 0] }
        }
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          user_id: 1,
          image_url: 1,
          caption: 1,
          created_at: 1,
          profiles: 1,
          likes_count: 1,
          comments_count: 1,
          is_liked: 1,
          is_bookmarked: 1
        }
      },
      { $sort: { created_at: -1 } },
      { $skip: offset },
      { $limit: limit }
    );

    const posts = await Post.aggregate(pipeline);

    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { caption } = req.body;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const image_url = req.file ? `${baseUrl}/uploads/${req.file.filename}` : '';

  try {
    const post = new Post({
      user_id: req.user.id,
      image_url,
      caption
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single post
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user_id', 'username full_name avatar_url');
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user_id.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    const { caption } = req.body;
    post.caption = caption;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user_id.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    await Post.findByIdAndDelete(req.params.id);

    // Also delete likes, comments, bookmarks
    await Like.deleteMany({ post_id: req.params.id });
    await Comment.deleteMany({ post_id: req.params.id });
    await Bookmark.deleteMany({ post_id: req.params.id });

    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
