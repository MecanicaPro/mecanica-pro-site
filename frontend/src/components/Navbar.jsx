import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Newspaper, 
  Brain, 
  BookOpen, 
  User,
  Settings,
  Wrench
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MecânicaPro</h1>
                <p className="text-xs text-gray-400">Portal de Mecânica Automotiva</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Link>

              <Link
                to="/noticias"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/noticias') 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Newspaper className="h-4 w-4" />
                <span>Notícias</span>
              </Link>

              <Link
                to="/quiz"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/quiz') 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>Quiz</span>
              </Link>

              <Link
                to="/cursos"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/cursos') 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Cursos</span>
              </Link>

              {user && user.user_type === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.username}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.user_type}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-slate-700"
                >
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/') 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Início</span>
          </Link>

          <Link
            to="/noticias"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/noticias') 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>Notícias</span>
          </Link>

          <Link
            to="/quiz"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/quiz') 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>Quiz</span>
          </Link>

          <Link
            to="/cursos"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/cursos') 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Cursos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

