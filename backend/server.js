const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Ensure correct protocol/host detection behind proxies (e.g., Render)
app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*'}));
app.use(express.json());
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pixelgram')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Route base path: on Vercel, the function is already mounted at /api
const basePath = process.env.VERCEL ? '' : '/api';
app.use(`${basePath}/auth`, require('./routes/auth'));
app.use(`${basePath}/posts`, require('./routes/posts'));
app.use(`${basePath}/likes`, require('./routes/likes'));
app.use(`${basePath}/comments`, require('./routes/comments'));
app.use(`${basePath}/bookmarks`, require('./routes/bookmarks'));
app.use(`${basePath}/followers`, require('./routes/followers'));

// Export app for Vercel; only listen in traditional server environments
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
