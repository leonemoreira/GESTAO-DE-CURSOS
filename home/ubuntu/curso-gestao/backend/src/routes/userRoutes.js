const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

// Todas as rotas de usuário requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       403:
 *         description: Acesso negado (requer permissão de Administrador)
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", authorize("ADMINISTRADOR"), userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário específico pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetail'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (usuário tentando acessar dados de outro usuário sem ser admin)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", userController.getUserById); // A verificação de permissão está no controller

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Nova senha (opcional)
 *               role:
 *                 type: string
 *                 enum: [ALUNO, ADMINISTRADOR]
 *                 description: Novo papel (apenas Admin pode alterar)
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro na requisição (dados inválidos)
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: Conflito (ex: email já em uso)
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", userController.updateUser); // A verificação de permissão está no controller

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário existente
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário a ser deletado
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: Requisição inválida (ex: admin tentando se auto-deletar)
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer permissão de Administrador)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", authorize("ADMINISTRADOR"), userController.deleteUser);

/**
 * @swagger
 * /users/{userId}/enrollments:
 *   get:
 *     summary: Retorna as matrículas de um usuário específico
 *     tags: [Usuários, Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário para buscar matrículas
 *     responses:
 *       200:
 *         description: Matrículas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnrollmentDetail'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
const courseController = require("../controllers/courseController"); // Importar aqui para evitar dependência circular
router.get("/:userId/enrollments", courseController.getEnrollmentsByUserId); // A verificação de permissão está no controller

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             enrollments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnrollmentDetail'
 *               description: Lista de matrículas do usuário
 *     Enrollment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         courseId:
 *           type: integer
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *     EnrollmentDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Enrollment'
 *         - type: object
 *           properties:
 *             course:
 *               $ref: '#/components/schemas/Course'
 */
