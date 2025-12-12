// Post routes
const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middlewares/verifyToken"); // exact path

const {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/postController");

// multer storage config (saves files to /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Public: get all posts
router.get("/", getAllPosts);

// Protected: get logged-in user's posts (put BEFORE /:id to avoid route conflict)
router.get("/mine", verifyToken, getMyPosts);

// Public: get single post by id
router.get("/:id", getPostById);

// Protected: create new post
router.post("/", verifyToken, upload.single("image"), createPost);

// Protected: update post by id
router.put("/:id", verifyToken, upload.single("image"), updatePost);

// Protected: delete post
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
