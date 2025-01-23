import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "xyzabcmani";

// Register a new user
export const registerUser = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return { message: "User registered successfully" };
  } catch (error) {
    if (error.code === 11000) {
      return { error: "Username already exists" };
    }
    return { error: "Registration failed" };
  }
};

// Login an existing user
export const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return { error: "User not found" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Invalid credentials" };

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    return { token };
  } catch (error) {
    return { error: "Login failed" };
  }
};

// Authenticate a token
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};
