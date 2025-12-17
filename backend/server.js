const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors({origin:['http://localhost:5173','https://blogo-85cs.vercel.app','https://blogo-q53n.vercel.app'
]}));
app.use(express.json());

/* ---------- Ensure uploads folder exists ---------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ---------- Serve uploads ---------- */
app.use("/uploads", express.static(uploadDir));

/* ---------- Hash admin password ONCE at server start ---------- */
if (!process.env.ADMIN_PASSWORD.startsWith("$2")) {
  const hashed = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
  process.env.ADMIN_PASSWORD = hashed;
}

/* ---------- Routes ---------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));



/* ---------- Health check ---------- */
app.get("/", (req, res) => {
  res.send("Blogo API running");
});

/* ---------- 404 ---------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------- DB + Server ---------- */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log("Server running on port", process.env.PORT)
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
