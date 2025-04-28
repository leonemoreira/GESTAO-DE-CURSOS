import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold">Gestão de Cursos</Link>
          <ul className="flex space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
                <li><Link to="/courses" className="hover:text-gray-300">Cursos</Link></li>
                <li><Link to="/notes" className="hover:text-gray-300">Minhas Anotações</Link></li>
                <li><Link to="/profile" className="hover:text-gray-300">Perfil</Link></li>
                {isAdmin && (
                  <li><Link to="/admin" className="hover:text-gray-300">Admin</Link></li>
                )}
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                <li><Link to="/register" className="hover:text-gray-300">Registrar</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* O conteúdo da rota atual será renderizado aqui */}
      </main>
      <footer className="bg-gray-200 text-center p-4 mt-8">
        © 2025 Sistema de Gestão de Cursos
      </footer>
    </div>
  );
};

export default Layout;
