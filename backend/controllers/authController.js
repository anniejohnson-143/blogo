const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------- REGISTER ---------- */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  const hashed = await bcrypt.hash(password, 10);

  await new User({ name, email, password: hashed }).save();
  res.json({ message: "Registered successfully" });
};

/* ---------- LOGIN (USER + ADMIN) ---------- */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  /* ADMIN LOGIN */
  if (email === process.env.ADMIN_EMAIL) {
    const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: { name: "Admin", email, role: "admin" }
    });
  }

  /* USER LOGIN */
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
