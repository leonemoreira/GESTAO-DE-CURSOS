const jwt = require("jsonwebtoken");
const config = require("../config/config");
const prisma = require("../config/prismaClient");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token de autenticação não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    req.user = user; // Adiciona o usuário ao objeto de requisição
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

const authorize = (roles = []) => {
  // roles pode ser uma string única ou um array de strings
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      // usuário não tem a role necessária
      return res.status(403).json({ message: "Acesso negado. Permissões insuficientes." });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
