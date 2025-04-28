const prisma = require("../config/prismaClient");

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });
  return user;
};

const updateUser = async (id, userData) => {
  const { password, ...data } = userData;
  
  // Se a senha for fornecida, hash ela
  if (password) {
    const bcrypt = require("bcryptjs");
    data.password = await bcrypt.hash(password, 10);
  }
  
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  return user;
};

const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: Number(id) },
  });
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
