const router = require("express").Router();
const multer = require("multer");
const verifyToken = require("../middlewares/verifyToken");
const ctrl = require("../controllers/postController");

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.get("/", ctrl.getAllPosts);
router.get("/mine", verifyToken, ctrl.getMyPosts);
router.get("/:id", ctrl.getPostById);
router.post("/", verifyToken, upload.single("image"), ctrl.createPost);
router.put("/:id", verifyToken, upload.single("image"), ctrl.updatePost);
router.delete("/:id", verifyToken, ctrl.deletePost);

module.exports = router;
