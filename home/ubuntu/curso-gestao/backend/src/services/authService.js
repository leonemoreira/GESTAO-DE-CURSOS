const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prismaClient");
const config = require("../config/config");

const register = async (userData) => {
  const { name, email, password, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "ALUNO",
    },
  });
  
  return user;
};

const login = async (credentials) => {
  const { email, password } = credentials;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

module.exports = {
  register,
  login,
};
