const courseService = require("../services/courseService");

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cursos", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar curso", error: error.message });
  }
};

const createCourse = async (req, res) => {
  // Apenas administradores podem criar cursos
  if (req.user.role !== "ADMINISTRADOR") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem criar cursos." });
  }
  
  try {
    const course = await courseService.createCourse(req.body, req.user.id);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar curso", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  // Apenas administradores ou o instrutor do curso podem atualizar
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Curso não encontrado" });
    }
    
    if (req.user.role !== "ADMINISTRADOR" && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado. Apenas administradores ou o instrutor do curso podem atualizar." });
    }
    
    const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar curso", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  // Apenas administradores podem deletar cursos
  if (req.user.role !== "ADMINISTRADOR") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem deletar cursos." });
  }
  
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(204).send(); // No content
  } catch (error) {
    // Handle case where course to delete is not found
    if (error.code === "P2025") { // Prisma error code for record not found on delete
      return res.status(404).json({ message: "Curso não encontrado para exclusão." });
    }
    res.status(500).json({ message: "Erro ao deletar curso", error: error.message });
  }
};

const enrollUserInCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  
  // Administradores podem matricular qualquer usuário, alunos só podem se matricular
  if (req.user.role !== "ADMINISTRADOR" && req.user.id !== Number(userId)) {
    return res.status(403).json({ message: "Acesso negado. Você só pode matricular a si mesmo." });
  }
  
  try {
    const enrollment = await courseService.enrollUserInCourse(userId, courseId);
    res.status(201).json(enrollment);
  } catch (error) {
    // Handle case where user is already enrolled
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Usuário já está matriculado neste curso." });
    }
    res.status(400).json({ message: "Erro ao matricular usuário no curso", error: error.message });
  }
};

const unenrollUserFromCourse = async (req, res) => {
  const { userId, courseId } = req.params;
  
  // Administradores podem desmatricular qualquer usuário, alunos só podem se desmatricular
  if (req.user.role !== "ADMINISTRADOR" && req.user.id !== Number(userId)) {
    return res.status(403).json({ message: "Acesso negado. Você só pode desmatricular a si mesmo." });
  }
  
  try {
    await courseService.unenrollUserFromCourse(userId, courseId);
    res.status(204).send(); // No content
  } catch (error) {
    // Handle case where enrollment is not found
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Matrícula não encontrada para exclusão." });
    }
    res.status(500).json({ message: "Erro ao desmatricular usuário do curso", error: error.message });
  }
};

const getEnrollmentsByUserId = async (req, res) => {
  const userId = req.params.userId;
  
  // Administradores podem ver matrículas de qualquer usuário, alunos só podem ver as próprias
  if (req.user.role !== "ADMINISTRADOR" && req.user.id !== Number(userId)) {
    return res.status(403).json({ message: "Acesso negado. Você só pode ver suas próprias matrículas." });
  }
  
  try {
    const enrollments = await courseService.getEnrollmentsByUserId(userId);
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar matrículas", error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollUserInCourse,
  unenrollUserFromCourse,
  getEnrollmentsByUserId
};
