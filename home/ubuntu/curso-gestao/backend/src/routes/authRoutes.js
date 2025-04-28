const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Rotas para registro e login de usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário (único)
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *               role:
 *                 type: string
 *                 enum: [ALUNO, ADMINISTRADOR]
 *                 description: Papel do usuário (opcional, padrão ALUNO)
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro na requisição (ex: dados inválidos)
 *       409:
 *         description: Conflito (ex: email já cadastrado)
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authController.login);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         role:
 *           type: string
 *           enum: [ALUNO, ADMINISTRADOR]
 *           description: Papel do usuário
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do usuário
 *       example:
 *         id: 1
 *         name: "João Silva"
 *         email: "joao.silva@example.com"
 *         role: "ALUNO"
 *         createdAt: "2024-04-28T10:00:00.000Z"
 *         updatedAt: "2024-04-28T10:00:00.000Z"
 */
