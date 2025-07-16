import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Trophy, Star } from 'lucide-react';

const QuizPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes/');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'Sem limite';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
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
          <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
          <p className="text-gray-400">
            Teste seus conhecimentos e ganhe pontos
          </p>
        </div>

        {!user && (
          <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-orange-500 mr-3" />
              <div>
                <h3 className="text-orange-500 font-medium">Faça login para participar</h3>
                <p className="text-gray-300 text-sm">
                  Entre na sua conta para fazer quizzes e ganhar pontos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    <Brain className="h-3 w-3 mr-1" />
                    Quiz
                  </Badge>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(quiz.time_limit)}
                  </div>
                </div>
                <CardTitle className="text-white text-lg">
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  {quiz.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{quiz.points_reward} pontos</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {quiz.questions?.length || 0} questões
                  </div>
                </div>

                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={!user}
                >
                  {user ? 'Iniciar Quiz' : 'Faça login para participar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              Nenhum quiz disponível
            </h3>
            <p className="text-gray-500">
              Os quizzes aparecerão aqui quando forem criados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

