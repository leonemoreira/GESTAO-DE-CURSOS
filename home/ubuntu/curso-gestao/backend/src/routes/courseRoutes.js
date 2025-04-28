const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Gerenciamento de cursos
 */

// Todas as rotas de curso requerem autenticação
router.use(authenticate);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retorna uma lista de todos os cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseWithInstructor'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", courseController.getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retorna um curso específico pelo ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseDetail'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", courseController.getCourseById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do curso
 *               description:
 *                 type: string
 *                 description: Descrição do curso
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseWithInstructor'
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer permissão de Administrador)
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", authorize("ADMINISTRADOR"), courseController.createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Atualiza um curso existente
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do curso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseWithInstructor'
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer ser Admin ou o instrutor do curso)
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", courseController.updateCourse); // A verificação de permissão está no controller

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Deleta um curso existente
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do curso a ser deletado
 *     responses:
 *       204:
 *         description: Curso deletado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer permissão de Administrador)
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", authorize("ADMINISTRADOR"), courseController.deleteCourse);

/**
 * @swagger
 * /courses/enroll:
 *   post:
 *     summary: Matricula um usuário em um curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID do usuário a ser matriculado
 *               courseId:
 *                 type: integer
 *                 description: ID do curso para matrícula
 *     responses:
 *       201:
 *         description: Matrícula realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentDetail'
 *       400:
 *         description: Erro na requisição
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       409:
 *         description: Usuário já está matriculado neste curso
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/enroll", courseController.enrollUserInCourse); // A verificação de permissão está no controller

/**
 * @swagger
 * /courses/unenroll/{userId}/{courseId}:
 *   delete:
 *     summary: Cancela a matrícula de um usuário em um curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do curso
 *     responses:
 *       204:
 *         description: Matrícula cancelada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Matrícula não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/unenroll/:userId/:courseId", courseController.unenrollUserFromCourse); // A verificação de permissão está no controller

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do curso
 *         title:
 *           type: string
 *           description: Título do curso
 *         description:
 *           type: string
 *           description: Descrição do curso
 *         instructorId:
 *           type: integer
 *           description: ID do instrutor do curso
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do curso
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do curso
 *     CourseWithInstructor:
 *       allOf:
 *         - $ref: '#/components/schemas/Course'
 *         - type: object
 *           properties:
 *             instructor:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *             enrollmentCount:
 *               type: integer
 *               description: Número de alunos matriculados no curso
 *     CourseDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/CourseWithInstructor'
 *         - type: object
 *           properties:
 *             enrollments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   enrolledAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 */
