import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Brain,
  Target,
  Award,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const { user, profile } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/progress/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <GuestHomePage />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg inline-block mb-4">
            <span className="text-sm font-medium">Plataforma de Aprendizado</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Domine a <span className="text-orange-500">Mecânica</span>
            <br />
            <span className="text-orange-500">Automotiva</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            A plataforma mais completa para aprender mecânica automotiva. 
            Cursos práticos, quizzes interativos e uma comunidade de especialistas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-slate-700 px-8 py-3 text-lg">
              <Brain className="mr-2 h-5 w-5" />
              Testar Conhecimento
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Today */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-orange-500" />
                  Progresso de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Lições Completadas</span>
                      <span className="text-white font-bold">
                        {dashboard?.today_progress?.lessons_completed || 0}/
                        {dashboard?.today_progress?.target_lessons || 3}
                      </span>
                    </div>
                    <Progress 
                      value={((dashboard?.today_progress?.lessons_completed || 0) / (dashboard?.today_progress?.target_lessons || 3)) * 100} 
                      className="h-3"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Quiz Score</span>
                      <span className="text-white font-bold">
                        {Math.round(profile?.total_quiz_score || 0)}%
                      </span>
                    </div>
                    <Progress 
                      value={profile?.total_quiz_score || 0} 
                      className="h-3"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Progresso Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {dashboard?.overall_progress?.completed_lessons || 0}
                    </div>
                    <div className="text-sm text-gray-400">Lições Completadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {dashboard?.overall_progress?.total_lessons || 0}
                    </div>
                    <div className="text-sm text-gray-400">Total de Lições</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {Math.round(dashboard?.overall_progress?.progress_percentage || 0)}%
                    </div>
                    <div className="text-sm text-gray-400">Progresso</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Progresso de Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Lições Completadas</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">
                      {dashboard?.today_progress?.lessons_completed || 0}/
                      {dashboard?.today_progress?.target_lessons || 3}
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">+15%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quiz Score</span>
                  <span className="text-white font-bold">
                    {Math.round(profile?.total_quiz_score || 0)}%
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-white font-bold">
                        {profile?.points || 0} pts
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      <span className="text-orange-500 font-bold">
                        Nível {profile?.level || 1}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="mr-2 h-5 w-5 text-orange-500" />
                  Próximo Nível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Nível Atual</span>
                    <Badge variant="secondary" className="bg-orange-500 text-white">
                      Nível {profile?.level || 1}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Progresso</span>
                      <span className="text-white text-sm">
                        {dashboard?.level_progress?.points_to_next_level || 0} pts restantes
                      </span>
                    </div>
                    <Progress 
                      value={dashboard?.level_progress ? 
                        ((dashboard.level_progress.current_points / dashboard.level_progress.next_level_points) * 100) : 0
                      } 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Primeiro Passo</div>
                      <div className="text-gray-400 text-sm">Primeira lição completada</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-gray-400 font-medium">Quiz Master</div>
                      <div className="text-gray-500 text-sm">100% em um quiz</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuestHomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg inline-block mb-6">
            <span className="text-sm font-medium">Plataforma de Aprendizado</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Domine a <span className="text-orange-500">Mecânica</span>
            <br />
            <span className="text-orange-500">Automotiva</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A plataforma mais completa para aprender mecânica automotiva. 
            Cursos práticos, quizzes interativos e uma comunidade de especialistas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-slate-700 px-8 py-3 text-lg">
              <Brain className="mr-2 h-5 w-5" />
              Testar Conhecimento
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-slate-800 p-6 rounded-lg">
              <BookOpen className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Cursos Práticos</h3>
              <p className="text-gray-400">
                Aprenda com lições estruturadas e conteúdo prático sobre mecânica automotiva.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-slate-800 p-6 rounded-lg">
              <Brain className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Quizzes Interativos</h3>
              <p className="text-gray-400">
                Teste seus conhecimentos com quizzes gamificados e receba feedback imediato.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-slate-800 p-6 rounded-lg">
              <Trophy className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sistema de Conquistas</h3>
              <p className="text-gray-400">
                Ganhe pontos, suba de nível e desbloqueie conquistas conforme progride.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

