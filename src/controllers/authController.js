const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthService = require("../services/authService");
require("dotenv").config();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await AuthService.registerUser(username, email, password);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthService.loginUser(email, password);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  const { email, token } = req.body;
  try {
    const isVerified = await AuthService.verifyToken(email, token);
    if (isVerified) {
      const user = await AuthService.getUserByEmail(email);

      const jwtToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res
        .status(200)
        .json({ message: "Email verified successfully", token: jwtToken });
    } else {
      res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
