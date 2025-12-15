const User = require("../models/User");
const Post = require("../models/Post");

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.adminGetAllPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name email");
  res.json(posts);
};

exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
};

exports.updatePost = async (req, res) => {
  const { title, content, category } = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content, category },
    { new: true }
  );
  res.json(post);
};
