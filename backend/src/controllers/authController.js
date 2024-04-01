const bcrypt = require("bcrypt");
const jwt = require("../config/jwt");
const { connectToDatabase } = require("../config/db");
const User = require("../models/User");

const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const db = await connectToDatabase();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await users.insertOne({
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const token = jwt.generateToken({
      user: { id: newUser.insertedId, email, role },
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectToDatabase();
    const users = db.collection("users");

    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.generateToken({
      user: { id: user._id, email: user.email, role: user.role },
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login };
