import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteError, setNoteError] = useState('');
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    const fetchCourseAndNotes = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError('');
      setNoteError('');
      setEnrollError('');
      try {
        const courseRes = await axios.get(`/api/courses/${id}`);
        setCourse(courseRes.data);

        // Check enrollment status
        const enrolled = courseRes.data.enrollments.some(enroll => enroll.userId === user.id);
        setIsEnrolled(enrolled);

        // Fetch user's notes for this course
        const notesRes = await axios.get(`/api/notes/course/${id}`);
        setNotes(notesRes.data); // API already filters notes for non-admins

      } catch (err) {
        console.error("Erro ao buscar detalhes do curso ou anotações:", err);
        setError('Não foi possível carregar os detalhes do curso ou as anotações.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndNotes();
  }, [id, user, isAuthenticated]);

  const handleEnroll = async () => {
    setEnrollError('');
    try {
      await axios.post('/api/courses/enroll', { userId: user.id, courseId: parseInt(id) });
      setIsEnrolled(true);
    } catch (err) {
      console.error("Erro ao matricular:", err);
      setEnrollError(err.response?.data?.message || 'Erro ao tentar se matricular.');
    }
  };

  const handleUnenroll = async () => {
    setEnrollError('');
    try {
      await axios.delete(`/api/courses/unenroll/${user.id}/${id}`);
      setIsEnrolled(false);
    } catch (err) {
      console.error("Erro ao cancelar matrícula:", err);
      setEnrollError(err.response?.data?.message || 'Erro ao tentar cancelar matrícula.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setNoteError('');
    try {
      const response = await axios.post('/api/notes', {
        content: newNoteContent,
        courseId: parseInt(id)
      });
      setNotes([...notes, response.data]);
      setNewNoteContent('');
    } catch (err) {
      console.error("Erro ao adicionar anotação:", err);
      setNoteError(err.response?.data?.message || 'Erro ao salvar anotação.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    setNoteError('');
    if (!window.confirm("Tem certeza que deseja deletar esta anotação?")) return;
    try {
      await axios.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error("Erro ao deletar anotação:", err);
      setNoteError(err.response?.data?.message || 'Erro ao deletar anotação.');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este curso? Esta ação é irreversível.")) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      navigate('/courses');
    } catch (err) {
      console.error("Erro ao deletar curso:", err);
      setError(err.response?.data?.message || 'Erro ao deletar curso.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Carregando detalhes do curso...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!course) {
    return <div className="text-center mt-8">Curso não encontrado.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">Instrutor: {course.instructor.name}</p>
          </div>
          {isAdmin && (
            <div className="flex space-x-2">
              {/* TODO: Link para página de edição */}
              {/* <Link to={`/admin/courses/${id}/edit`} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-sm">Editar</Link> */}
              <button 
                onClick={handleDeleteCourse}
                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
              >
                Deletar Curso
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-800 mb-4">{course.description || 'Sem descrição detalhada.'}</p>
        
        {enrollError && <p className="text-red-500 text-sm mb-4">{enrollError}</p>}
        {isEnrolled ? (
          <button 
            onClick={handleUnenroll}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mb-6"
          >
            Cancelar Matrícula
          </button>
        ) : (
          <button 
            onClick={handleEnroll}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-6"
          >
            Matricular-se
          </button>
        )}
      </div>

      {/* Seção de Anotações */}
      {isEnrolled && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Minhas Anotações para este Curso</h2>
          
          {noteError && <p className="text-red-500 text-sm mb-4">{noteError}</p>}
          
          {/* Formulário para adicionar nova anotação */}
          <form onSubmit={handleAddNote} className="mb-6">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Digite sua anotação aqui..."
              required
              className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            ></textarea>
            <button 
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Adicionar Anotação
            </button>
          </form>

          {/* Lista de anotações existentes */}
          {notes.length > 0 ? (
            <ul className="space-y-4">
              {notes.map(note => (
                <li key={note.id} className="border p-4 rounded bg-gray-50 relative">
                  <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-2">Criado em: {new Date(note.createdAt).toLocaleString()}</p>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
                  >
                    Deletar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não tem anotações para este curso.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
