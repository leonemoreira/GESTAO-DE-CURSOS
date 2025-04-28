const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Anotações
 *   description: Gerenciamento de anotações dos alunos
 */

// Todas as rotas de anotações requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retorna todas as anotações (apenas para administradores)
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de anotações obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer permissão de Administrador)
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", authorize("ADMINISTRADOR"), noteController.getAllNotes);

/**
 * @swagger
 * /notes/user/{userId}:
 *   get:
 *     summary: Retorna anotações de um usuário específico
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Anotações obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/user/:userId", noteController.getNotesByUserId); // Verificação no controller

/**
 * @swagger
 * /notes/course/{courseId}:
 *   get:
 *     summary: Retorna anotações de um curso específico
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Anotações obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/course/:courseId", noteController.getNotesByCourseId); // Verificação no controller

/**
 * @swagger
 * /notes/stats:
 *   get:
 *     summary: Retorna estatísticas de anotações (apenas para administradores)
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statsByUser:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       noteCount:
 *                         type: integer
 *                 statsByCourse:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                       noteCount:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer permissão de Administrador)
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/stats", authorize("ADMINISTRADOR"), noteController.getNoteStats);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Retorna uma anotação específica pelo ID
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da anotação
 *     responses:
 *       200:
 *         description: Anotação obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Anotação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", noteController.getNoteById); // Verificação no controller

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Cria uma nova anotação
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - courseId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Conteúdo da anotação
 *               courseId:
 *                 type: integer
 *                 description: ID do curso relacionado à anotação
 *               title:
 *                 type: string
 *                 description: Título da anotação (opcional)
 *     responses:
 *       201:
 *         description: Anotação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", noteController.createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Atualiza uma anotação existente
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da anotação a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Anotação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas o proprietário pode atualizar)
 *       404:
 *         description: Anotação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", noteController.updateNote); // Verificação no service/controller

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Deleta uma anotação existente
 *     tags: [Anotações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da anotação a ser deletada
 *     responses:
 *       204:
 *         description: Anotação deletada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas o proprietário pode deletar)
 *       404:
 *         description: Anotação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", noteController.deleteNote); // Verificação no service/controller

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da anotação
 *         title:
 *           type: string
 *           description: Título da anotação (opcional)
 *         content:
 *           type: string
 *           description: Conteúdo da anotação
 *         userId:
 *           type: integer
 *           description: ID do usuário que criou a anotação
 *         courseId:
 *           type: integer
 *           description: ID do curso relacionado à anotação
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da anotação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização da anotação
 */
