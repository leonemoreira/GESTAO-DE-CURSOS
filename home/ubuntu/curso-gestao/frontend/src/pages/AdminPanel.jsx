import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for creating a new course
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [createCourseError, setCreateCourseError] = useState('');
  const [createCourseSuccess, setCreateCourseSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, coursesRes, statsRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/courses'),
          axios.get('/api/notes/stats')
        ]);
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Erro ao buscar dados do painel admin:", err);
        setError('Não foi possível carregar os dados do painel de administração.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário? Esta ação é irreversível.")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      alert(err.response?.data?.message || 'Erro ao deletar usuário.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Tem certeza que deseja deletar este curso? Esta ação é irreversível.")) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      console.error("Erro ao deletar curso:", err);
      alert(err.response?.data?.message || 'Erro ao deletar curso.');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreatingCourse(true);
    setCreateCourseError('');
    setCreateCourseSuccess('');
    try {
      const response = await axios.post('/api/courses', {
        title: newCourseTitle,
        description: newCourseDescription
      });
      setCourses([...courses, response.data]);
      setNewCourseTitle('');
      setNewCourseDescription('');
      setCreateCourseSuccess('Curso criado com sucesso!');
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      setCreateCourseError(err.response?.data?.message || 'Erro ao criar curso.');
    } finally {
      setCreatingCourse(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Carregando painel de administração...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>

      {/* Estatísticas */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Usuários Registrados</h3>
          <p className="text-2xl">{users.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Cursos Criados</h3>
          <p className="text-2xl">{courses.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg">Total de Anotações</h3>
          <p className="text-2xl">{stats?.statsByUser.reduce((sum, stat) => sum + stat.noteCount, 0) || 0}</p>
        </div>
      </div>

      {/* Criar Novo Curso */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Criar Novo Curso</h2>
        {createCourseError && <p className="text-red-500 mb-2">{createCourseError}</p>}
        {createCourseSuccess && <p className="text-green-500 mb-2">{createCourseSuccess}</p>}
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label htmlFor="newCourseTitle" className="block text-sm font-medium text-gray-700">Título do Curso</label>
            <input
              id="newCourseTitle"
              type="text"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="newCourseDescription" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="newCourseDescription"
              value={newCourseDescription}
              onChange={(e) => setNewCourseDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={creatingCourse}
            className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {creatingCourse ? 'Criando...' : 'Criar Curso'}
          </button>
        </form>
      </div>

      {/* Gerenciamento de Cursos */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Gerenciar Cursos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrutor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matriculados</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/courses/${course.id}`} className="text-indigo-600 hover:underline">{course.title}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrollmentCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <Link to={`/admin/courses/${course.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</Link> */}
                    <button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 hover:text-red-900">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gerenciamento de Usuários */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Gerenciar Usuários</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <Link to={`/admin/users/${user.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</Link> */}
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
