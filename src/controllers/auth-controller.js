const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/auth-model");

const JWT_SECRET = "your_secret_key"; // Change this to env var in production

const register = async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name) errors.push({ field: "name", message: "Name is required." });
  if (!email) errors.push({ field: "email", message: "Email is required." });
  if (!password) errors.push({ field: "password", message: "Password is required." });
  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const emailExists = await User.emailExists(email);
    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.createUser(name, email, hashedPassword);
    res.status(201).json({ message: "User has been created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true if https
      maxAge: 3600000,
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
