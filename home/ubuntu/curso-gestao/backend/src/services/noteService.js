const notesDb = require("../db/notesDb");

const getAllNotes = () => {
  return notesDb.getAllNotes();
};

const getNotesByUserId = (userId) => {
  return notesDb.getNotesByUserId(Number(userId));
};

const getNotesByCourseId = (courseId) => {
  return notesDb.getNotesByCourseId(Number(courseId));
};

const getNoteById = (id) => {
  return notesDb.getNoteById(id);
};

const createNote = (noteData, userId) => {
  // Ensure userId is included in the note data
  const dataToSave = {
    ...noteData,
    userId: Number(userId)
  };
  return notesDb.createNote(dataToSave);
};

const updateNote = (id, noteData, userId) => {
  const note = notesDb.getNoteById(id);
  if (!note) {
    return null; // Note not found
  }
  // Ensure only the owner can update the note
  if (note.userId !== Number(userId)) {
    throw new Error("Acesso negado. Você só pode atualizar suas próprias anotações.");
  }
  return notesDb.updateNote(id, noteData);
};

const deleteNote = (id, userId) => {
  const note = notesDb.getNoteById(id);
  if (!note) {
    return false; // Note not found
  }
  // Ensure only the owner or an admin can delete the note
  // Assuming req.user is available and contains the role
  // This check might be better placed in the controller or middleware
  // For simplicity here, we'll assume userId is passed correctly
  if (note.userId !== Number(userId)) { // Add admin check if needed
     throw new Error("Acesso negado. Você só pode deletar suas próprias anotações.");
  }
  return notesDb.deleteNote(id);
};

const getNoteStats = () => {
  const statsByUser = notesDb.getNoteStatsByUser();
  const statsByCourse = notesDb.getNoteStatsByCourse();
  return { statsByUser, statsByCourse };
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
