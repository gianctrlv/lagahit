const bcrypt = require("bcryptjs");
const User = require("../models/auth-model");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];

  if (!name) errors.push({ field: name, message: "Name is required." });
  if (!email) errors.push({ field: email, message: "email is required." });
  if (!password)
    errors.push({ field: password, message: "password is required." });
  if (errors.length > 0) return res.status(404).json(errors);

  try {
    const emailExists = await User.emailExists(email);
    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      await User.createUser(name, email, hashedPassword);
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({
      message: "User has been created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async () => {};

module.exports = {
  register,
  login,
};
