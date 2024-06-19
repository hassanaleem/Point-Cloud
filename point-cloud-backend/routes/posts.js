const express = require('express');
const router = express.Router();
const Post = require('../models/posts');

// Middleware to parse JSON bodies
router.use(express.json());

// GET /posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET /posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.json(post);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST /posts
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).send('Invalid data');
    }
    const newPost = new Post({
      title,
      content,
      author,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// PUT /posts/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).send('Invalid data');
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    post.title = title;
    post.content = content;
    post.author = author;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
