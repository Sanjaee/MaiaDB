// src/services/authService.js
const bcrypt = require("bcryptjs");
const UserModel = require("../models/user");
const EmailUtils = require("../utils/emailUtils");
const jwt = require("jsonwebtoken");

module.exports = {
  registerUser: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser(username, email, hashedPassword);

    // Generate and save verification token using Math.random()
    const verificationToken = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit token
    await UserModel.updateUserVerificationToken(user.id, verificationToken);

    // Send verification email
    await EmailUtils.sendVerificationEmail(email, verificationToken);
  },

  loginUser: async (email, password) => {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    if (!user.isVerified) {
      throw new Error("Email is not verified");
    }

    return user;
  },

  verifyToken: async (email, token) => {
    try {
      // Find user by email
      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Compare tokens
      if (user.verificationToken === token) {
        // Update verification status to true
        await UserModel.updateUserVerificationStatus(user.id);
        return true; // Token matches, verification successful
      } else {
        return false; // Token doesn't match, verification failed
      }
    } catch (error) {
      throw new Error("Verification failed: " + error.message);
    }
  },

  // Fungsi untuk mendapatkan data pengguna berdasarkan email
  getUserByEmail: async (email) => {
    return await UserModel.findUserByEmail(email);
  },
};
