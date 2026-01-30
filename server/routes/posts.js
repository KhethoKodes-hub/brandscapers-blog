// server/routes/posts.js
const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');

const Post = require('../models/Post');
const verifyUser = require('../middleware/verifyUser');
const verifyAdmin = require('../middleware/verifyAdmin');
const postController = require('../controllers/postController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --------------------
// CREATE POST (Admin only)
// --------------------
router.post('/', verifyAdmin, upload.array('files', 10), async (req, res) => {
  try {
    const { title, content, excerpt, tags, slug, published, pinned } = req.body;
    if (!title || !content || !slug)
      return res.status(400).json({ msg: 'Missing title/content/slug' });

    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.slice(0, 200),
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      slug,
      published: published === 'true' || published === true,
      pinned: pinned === 'true' || pinned === true,
      author: { name: req.user.name, id: req.user.uid }
    });

    // Upload media
    if (req.files && req.files.length) {
      post.media = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (err, uploadResult) => {
              if (err) return reject(err);
              resolve(uploadResult);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
        post.media.push({ url: result.secure_url, type: result.resource_type });
        if (!post.coverImage && result.resource_type === 'image') post.coverImage = result.secure_url;
      }
    }

    await post.save();
    res.json({ post });
  } catch (err) {
    console.error('CREATE POST ERROR:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// --------------------
// GET ALL POSTS
// --------------------
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false, published: true })
      .sort({ pinned: -1, createdAt: -1 })
      .limit(100);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --------------------
// GET SINGLE POST BY SLUG
// --------------------
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, deleted: false }).lean();
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --------------------
// LIKE / UNLIKE POST
// --------------------
router.put('/:postId/like', verifyUser, postController.likePost);
router.put('/:postId/unlike', verifyUser, postController.unlikePost);

// --------------------
// COMMENTS ROUTES
// --------------------
router.post('/:postId/comments', verifyUser, postController.addComment);
router.put('/comments/:commentId', verifyUser, postController.editComment);
router.delete('/comments/:commentId', verifyUser, postController.deleteComment);
router.put('/comments/:commentId/like', verifyUser, postController.likeComment);

// --------------------
// DELETE POST (Admin only)
// --------------------
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    post.deleted = true;
    await post.save();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
