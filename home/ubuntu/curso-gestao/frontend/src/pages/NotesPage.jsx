import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        // Buscar todas as anotações do usuário
        const notesRes = await axios.get(`/api/notes/user/${user.id}`);
        setNotes(notesRes.data);
        
        // Buscar cursos para o filtro
        const enrollmentsRes = await axios.get(`/api/users/${user.id}/enrollments`);
        const userCourses = enrollmentsRes.data.map(enrollment => enrollment.course);
        setCourses(userCourses);
      } catch (err) {
        console.error("Erro ao buscar anotações:", err);
        setError('Não foi possível carregar suas anotações.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta anotação?")) return;
    try {
      await axios.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error("Erro ao deletar anotação:", err);
      setError(err.response?.data?.message || 'Erro ao deletar anotação.');
    }
  };

  // Filtrar notas pelo curso selecionado
  const filteredNotes = selectedCourse === 'all' 
    ? notes 
    : notes.filter(note => note.courseId === parseInt(selectedCourse));

  if (loading) {
    return <div className="text-center mt-8">Carregando anotações...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Minhas Anotações</h1>
      
      {notes.length === 0 ? (
        <p>Você ainda não tem anotações. Matricule-se em cursos e comece a fazer anotações!</p>
      ) : (
        <>
          {/* Filtro de cursos */}
          <div className="mb-6">
            <label htmlFor="courseFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por curso:
            </label>
            <select
              id="courseFilter"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todos os cursos</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          {/* Lista de anotações */}
          {filteredNotes.length > 0 ? (
            <div className="space-y-6">
              {filteredNotes.map(note => {
                const course = courses.find(c => c.id === note.courseId);
                return (
                  <div key={note.id} className="bg-white p-6 rounded-lg shadow-md relative">
                    <div className="mb-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {course ? course.title : `Curso ID: ${note.courseId}`}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      Deletar
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Nenhuma anotação encontrada para o filtro selecionado.</p>
          )}
        </>
      )}
    </div>
  );
};

export default NotesPage;
