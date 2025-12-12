// Post model: title, content, optional image filename, category, author reference
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: "" },
  image: { type: String, default: null }, // stores filename saved in /uploads
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
