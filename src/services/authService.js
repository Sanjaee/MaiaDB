const bcrypt = require("bcryptjs");
const UserModel = require("../models/user");
const EmailUtils = require("../utils/emailUtils");
module.exports = {
  registerUser: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser(username, email, hashedPassword);

    const verificationToken = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit token
    await UserModel.updateUserVerificationToken(user.id, verificationToken);

    await EmailUtils.sendVerificationEmail(email, username, verificationToken); // Tambahkan `username` di sini
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
      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.verificationToken === token) {
        await UserModel.updateUserVerificationStatus(user.id);
        return true;
      } else {
        return false;
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
