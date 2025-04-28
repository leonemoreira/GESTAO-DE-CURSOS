const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON que armazenará as anotações
const dbPath = path.join(__dirname, 'notes.json');

// Inicializa o banco de dados se não existir
const initializeDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ notes: [] }));
  }
};

// Lê todas as anotações
const getAllNotes = () => {
  initializeDb();
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  return data.notes;
};

// Obtém anotações por ID do usuário
const getNotesByUserId = (userId) => {
  const notes = getAllNotes();
  return notes.filter(note => note.userId === userId);
};

// Obtém anotações por ID do curso
const getNotesByCourseId = (courseId) => {
  const notes = getAllNotes();
  return notes.filter(note => note.courseId === courseId);
};

// Obtém uma anotação específica por ID
const getNoteById = (id) => {
  const notes = getAllNotes();
  return notes.find(note => note.id === id);
};

// Cria uma nova anotação
const createNote = (noteData) => {
  const notes = getAllNotes();
  
  // Gera um ID único
  const id = Date.now().toString();
  
  const newNote = {
    id,
    ...noteData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.push(newNote);
  
  fs.writeFileSync(dbPath, JSON.stringify({ notes }));
  return newNote;
};

// Atualiza uma anotação existente
const updateNote = (id, noteData) => {
  const notes = getAllNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedNote = {
    ...notes[index],
    ...noteData,
    updatedAt: new Date().toISOString()
  };
  
  notes[index] = updatedNote;
  
  fs.writeFileSync(dbPath, JSON.stringify({ notes }));
  return updatedNote;
};

// Remove uma anotação
const deleteNote = (id) => {
  const notes = getAllNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) {
    return false;
  }
  
  fs.writeFileSync(dbPath, JSON.stringify({ notes: filteredNotes }));
  return true;
};

// Obtém estatísticas de anotações por usuário
const getNoteStatsByUser = () => {
  const notes = getAllNotes();
  const stats = {};
  
  notes.forEach(note => {
    if (!stats[note.userId]) {
      stats[note.userId] = 0;
    }
    stats[note.userId]++;
  });
  
  return Object.entries(stats).map(([userId, count]) => ({
    userId: userId,
    noteCount: count
  }));
};

// Obtém estatísticas de anotações por curso
const getNoteStatsByCourse = () => {
  const notes = getAllNotes();
  const stats = {};
  
  notes.forEach(note => {
    if (!stats[note.courseId]) {
      stats[note.courseId] = 0;
    }
    stats[note.courseId]++;
  });
  
  return Object.entries(stats).map(([courseId, count]) => ({
    courseId: courseId,
    noteCount: count
  }));
};

module.exports = {
  getAllNotes,
  getNotesByUserId,
  getNotesByCourseId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteStatsByUser,
  getNoteStatsByCourse
};
