import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import QuizPage from './pages/QuizPage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/noticias" element={<NewsPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/cursos" element={<CoursesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
