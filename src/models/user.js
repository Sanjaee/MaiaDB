const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createUser: async (username, email, password) => {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    return user;
  },

  findUserByEmail: async (email) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  },

  updateUserVerificationToken: async (userId, verificationToken) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { verificationToken: String(verificationToken) }, // Konversi ke string
    });
    return updatedUser;
  },

  updateUserVerificationStatus: async (userId) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
    return updatedUser;
  },
};
