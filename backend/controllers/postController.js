const Post = require("../models/Post");

/* PUBLIC */
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json(posts);
};

/* USER ONLY */
exports.getMyPosts = async (req, res) => {
  if (!req.user.id) return res.status(403).json({ message: "Users only" });

  const posts = await Post.find({ author: req.user.id });
  res.json(posts);
};

exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
};

exports.createPost = async (req, res) => {
  const post = await Post.create({
    ...req.body,
    image: req.file ? req.file.filename : null,
    author: req.user.id
  });
  res.json(post);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  Object.assign(post, req.body);
  if (req.file) post.image = req.file.filename;
  await post.save();
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await post.deleteOne();
  res.json({ message: "Deleted" });
};
