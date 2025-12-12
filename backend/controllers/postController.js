// Post controller: create / read / update / delete
// Uses req.user (from verifyToken) for protected routes

const Post = require("../models/Post");

// GET all posts (public)
exports.getAllPosts = async (req, res) => {
  try {
    // populate author name for display
    const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("getAllPosts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET posts of logged-in user (dashboard)
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("getMyPosts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single post by ID (public)
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("getPostById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE post (protected)
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required" });

    const image = req.file ? req.file.filename : null;

    const post = new Post({
      title,
      content,
      category: category || "",
      image,
      author: req.user.id
    });

    await post.save();
    // populate before sending
    const saved = await Post.findById(post._id).populate("author", "name");
    res.status(201).json(saved);
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE post (protected, author only)
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // check ownership
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    // update fields if provided
    if (title) post.title = title;
    if (content) post.content = content;
    if (category !== undefined) post.category = category;
    if (req.file) post.image = req.file.filename;

    await post.save();
    const updated = await Post.findById(post._id).populate("author", "name");
    res.json(updated);
  } catch (err) {
    console.error("updatePost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE post (protected, author only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
