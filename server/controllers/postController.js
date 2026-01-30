// server/controllers/postController.js
const Post = require('../models/Post');

// --------------------
// LIKE POST
// --------------------
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.user.uid;

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes += 1;
    post.likedBy.push(userId);

    await post.save();
    res.json({ likes: post.likes, liked: true });
  } catch (err) {
    console.error('LIKE POST ERROR:', err);
    res.status(500).json({ message: 'Error liking post' });
  }
};

// --------------------
// UNLIKE POST
// --------------------
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.user.uid;

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }

    post.likes = Math.max(0, post.likes - 1);
    post.likedBy = post.likedBy.filter(id => id !== userId);

    await post.save();
    res.json({ likes: post.likes, liked: false });
  } catch (err) {
    console.error('UNLIKE POST ERROR:', err);
    res.status(500).json({ message: 'Error unliking post' });
  }
};

// --------------------
// ADD COMMENT
// --------------------
// server/controllers/postController.js
exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text required' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      userId: req.user.uid,
      name: req.user.name, // <-- use email here
      text
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('ADD COMMENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};


// --------------------
// EDIT COMMENT
// --------------------
exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.uid;

    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findOne({ 'comments._id': commentId });
    if (!post) return res.status(404).json({ message: 'Comment not found' });

    const comment = post.comments.id(commentId);
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    comment.text = text;
    await post.save();

    res.json({ message: 'Comment updated', comment });
  } catch (err) {
    console.error('EDIT COMMENT ERROR:', err);
    res.status(500).json({ message: 'Error editing comment' });
  }
};

// --------------------
// DELETE COMMENT
// --------------------
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.uid;

    const post = await Post.findOne({ 'comments._id': commentId });
    if (!post) return res.status(404).json({ message: 'Comment not found' });

    const comment = post.comments.id(commentId);
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    comment.remove();
    await post.save();

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('DELETE COMMENT ERROR:', err);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

// --------------------
// LIKE COMMENT
// --------------------
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.uid;

    const post = await Post.findOne({ 'comments._id': commentId });
    if (!post) return res.status(404).json({ message: 'Comment not found' });

    const comment = post.comments.id(commentId);

    if (!comment.likedBy) comment.likedBy = []; // make sure array exists
    if (comment.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    comment.likes = (comment.likes || 0) + 1;
    comment.likedBy.push(userId);

    await post.save();
    res.json({ likes: comment.likes, liked: true });
  } catch (err) {
    console.error('LIKE COMMENT ERROR:', err);
    res.status(500).json({ message: 'Error liking comment' });
  }
};
