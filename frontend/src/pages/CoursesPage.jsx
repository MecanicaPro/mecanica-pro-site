import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react';

const CoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (level) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return 'Não definido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cursos</h1>
          <p className="text-gray-400">
            Trilhas de conhecimento em mecânica automotiva
          </p>
        </div>

        {!user && (
          <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-orange-500 mr-3" />
              <div>
                <h3 className="text-orange-500 font-medium">Faça login para acessar os cursos</h3>
                <p className="text-gray-300 text-sm">
                  Entre na sua conta para acompanhar seu progresso
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className={`text-white ${getDifficultyColor(course.difficulty_level)}`}>
                    {getDifficultyLabel(course.difficulty_level)}
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {course.category}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Lições</span>
                    <span className="text-white">{course.lesson_count || 0}</span>
                  </div>

                  {user && course.user_progress && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-white">
                            {course.user_progress.completed_lessons}/{course.user_progress.total_lessons}
                          </span>
                        </div>
                        <Progress 
                          value={course.user_progress.progress_percentage} 
                          className="h-2"
                        />
                      </div>
                      
                      {course.user_progress.progress_percentage === 100 && (
                        <div className="flex items-center text-green-500 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Concluído
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Button 
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
                  disabled={!user}
                >
                  {user ? 'Acessar Curso' : 'Faça login para acessar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              Nenhum curso disponível
            </h3>
            <p className="text-gray-500">
              Os cursos aparecerão aqui quando forem criados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

