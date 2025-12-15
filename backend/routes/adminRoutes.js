const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const User = require("../models/User");
const Post = require("../models/Post");

/* ===============================
   GET ALL AUTHORS
================================ */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({
      email: { $ne: process.env.ADMIN_EMAIL }
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
});

/* ===============================
   DELETE AUTHOR + POSTS
================================ */
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await Post.deleteMany({ author: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Author deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ===============================
   GET ALL POSTS
================================ */
router.get("/posts", adminAuth, async (req, res) => {
  const posts = await Post.find().populate("author", "name email");
  res.json(posts);
});

/* ===============================
   DELETE POST
================================ */
router.delete("/posts/:id", adminAuth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

module.exports = router;
