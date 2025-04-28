const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
  }
};

const updateUser = async (req, res) => {
  // Garante que apenas administradores ou o próprio usuário possam atualizar
  if (req.user.role !== "ADMINISTRADOR" && req.user.id !== Number(req.params.id)) {
    return res.status(403).json({ message: "Acesso negado." });
  }
  
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
     // Handle potential errors, e.g., duplicate email on update
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({ message: "Email já está em uso por outro usuário." });
    }
    res.status(400).json({ message: "Erro ao atualizar usuário", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  // Garante que apenas administradores possam deletar usuários
  if (req.user.role !== "ADMINISTRADOR") {
      return res.status(403).json({ message: "Acesso negado. Apenas administradores podem deletar usuários." });
  }
  // Impede que um administrador se delete
  if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({ message: "Administradores não podem se auto-deletar." });
  }

  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send(); // No content
  } catch (error) {
     // Handle case where user to delete is not found
    if (error.code === "P2025") { // Prisma error code for record not found on delete
        return res.status(404).json({ message: "Usuário não encontrado para exclusão." });
    }
    res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
