const noteService = require("../services/noteService");

const getAllNotes = async (req, res) => {
  try {
    // Apenas administradores podem ver todas as anotações
    if (req.user.role !== "ADMINISTRADOR") {
      return res.status(403).json({ message: "Acesso negado. Apenas administradores podem ver todas as anotações." });
    }
    
    const notes = noteService.getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar anotações", error: error.message });
  }
};

const getNotesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Administradores podem ver anotações de qualquer usuário, alunos só podem ver as próprias
    if (req.user.role !== "ADMINISTRADOR" && req.user.id !== Number(userId)) {
      return res.status(403).json({ message: "Acesso negado. Você só pode ver suas próprias anotações." });
    }
    
    const notes = noteService.getNotesByUserId(userId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar anotações do usuário", error: error.message });
  }
};

const getNotesByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Administradores podem ver todas as anotações de um curso
    // Para alunos, filtramos apenas suas próprias anotações deste curso
    let notes = noteService.getNotesByCourseId(courseId);
    
    if (req.user.role !== "ADMINISTRADOR") {
      notes = notes.filter(note => note.userId === req.user.id);
    }
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar anotações do curso", error: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = noteService.getNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Anotação não encontrada" });
    }
    
    // Administradores podem ver qualquer anotação, alunos só podem ver as próprias
    if (req.user.role !== "ADMINISTRADOR" && note.userId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado. Você só pode ver suas próprias anotações." });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar anotação", error: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const note = noteService.createNote(req.body, req.user.id);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar anotação", error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const updatedNote = noteService.updateNote(req.params.id, req.body, req.user.id);
    
    if (!updatedNote) {
      return res.status(404).json({ message: "Anotação não encontrada" });
    }
    
    res.status(200).json(updatedNote);
  } catch (error) {
    if (error.message.includes("Acesso negado")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(400).json({ message: "Erro ao atualizar anotação", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const result = noteService.deleteNote(req.params.id, req.user.id);
    
    if (!result) {
      return res.status(404).json({ message: "Anotação não encontrada" });
    }
    
    res.status(204).send(); // No content
  } catch (error) {
    if (error.message.includes("Acesso negado")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Erro ao deletar anotação", error: error.message });
  }
};

const getNoteStats = async (req, res) => {
  try {
    // Apenas administradores podem ver estatísticas
    if (req.user.role !== "ADMINISTRADOR") {
      return res.status(403).json({ message: "Acesso negado. Apenas administradores podem ver estatísticas." });
    }
    
    const stats = noteService.getNoteStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas de anotações", error: error.message });
  }
};

module.exports = {
  getAllNotes,
  getNotesByUserId,
  getNotesByCourseId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteStats
};
