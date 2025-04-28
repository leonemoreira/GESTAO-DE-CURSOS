import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const [enrollmentsRes, notesRes] = await Promise.all([
          axios.get(`/api/users/${user.id}/enrollments`),
          axios.get(`/api/notes/user/${user.id}`)
        ]);
        setEnrollments(enrollmentsRes.data);
        setNotesCount(notesRes.data.length);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-8">Carregando dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo(a) ao seu Dashboard, {user?.name || 'Usuário'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Cursos Matriculados */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Meus Cursos Matriculados ({enrollments.length})</h2>
          {enrollments.length > 0 ? (
            <ul className="space-y-2">
              {enrollments.slice(0, 5).map(enroll => (
                <li key={enroll.id} className="border-b pb-2">
                  <Link to={`/courses/${enroll.course.id}`} className="text-indigo-600 hover:underline">
                    {enroll.course.title}
                  </Link>
                </li>
              ))}
              {enrollments.length > 5 && (
                 <li><Link to="/courses" className="text-sm text-indigo-600 hover:underline">Ver todos...</Link></li>
              )}
            </ul>
          ) : (
            <p>Você não está matriculado em nenhum curso ainda.</p>
          )}
          <Link to="/courses" className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">Ver Cursos</Link>
        </div>

        {/* Card Anotações */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Minhas Anotações ({notesCount})</h2>
          <p className="mb-4">Você tem {notesCount} anotações salvas.</p>
          <Link to="/notes" className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Ver Anotações</Link>
        </div>

        {/* Card Perfil */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Meu Perfil</h2>
          <p className="mb-4">Gerencie suas informações pessoais e senha.</p>
          <Link to="/profile" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Ir para Perfil</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
