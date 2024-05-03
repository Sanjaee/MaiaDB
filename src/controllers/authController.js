const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthService = require("../services/authService");
require("dotenv").config();

// Route for user registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Register user
    await AuthService.registerUser(username, email, password);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Login user
    const user = await AuthService.loginUser(email, password);

    // Create and send JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration time
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
      // Jika verifikasi berhasil, ambil data pengguna dari AuthService
      const user = await AuthService.getUserByEmail(email);

      // Buat dan kirim token JWT
      const jwtToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Waktu kedaluwarsa token
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
