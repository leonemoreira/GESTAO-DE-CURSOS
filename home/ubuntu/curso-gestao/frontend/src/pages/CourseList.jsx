import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth(); // Para mostrar botão de criar curso

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError('Não foi possível carregar a lista de cursos.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Carregando cursos...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Cursos</h1>
        {isAdmin && (
          <Link 
            to="/admin" // Ou uma rota específica para criar curso
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Criar Novo Curso
          </Link>
        )}
      </div>
      
      {courses.length === 0 ? (
        <p>Nenhum curso disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-2">Instrutor: {course.instructor.name}</p>
                <p className="text-gray-700 mb-4 truncate">{course.description || 'Sem descrição'}</p>
                <p className="text-sm text-gray-500">Alunos matriculados: {course.enrollmentCount}</p>
              </div>
              <Link 
                to={`/courses/${course.id}`} 
                className="mt-4 inline-block text-center bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
