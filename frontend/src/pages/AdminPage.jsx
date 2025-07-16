import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseManager from '../components/admin/CourseManager';
import QuizManager from '../components/admin/QuizManager';
import NewsManager from '../components/admin/NewsManager';
import { 
  Users, 
  BookOpen, 
  Brain, 
  Newspaper, 
  Settings,
  BarChart3,
  TrendingUp
} from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.user_type === 'admin') {
      fetchAdminDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (error) {
      console.error('Erro ao buscar dashboard admin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.user_type !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Settings className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              Acesso Negado
            </h3>
            <p className="text-gray-500">
              Apenas administradores podem acessar esta página.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-gray-400">
            Gerencie conteúdo e acompanhe estatísticas da plataforma
          </p>
        </div>

        {/* Statistics Cards */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Usuários</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboard.statistics?.total_users || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Cursos</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboard.statistics?.total_courses || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Quizzes</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboard.statistics?.total_quizzes || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Newspaper className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Notícias</p>
                    <p className="text-2xl font-bold text-white">
                      {dashboard.statistics?.total_news || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Management Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="courses" className="text-white">
              <BookOpen className="mr-2 h-4 w-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="text-white">
              <Brain className="mr-2 h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="news" className="text-white">
              <Newspaper className="mr-2 h-4 w-4" />
              Notícias
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">
              <BarChart3 className="mr-2 h-4 w-4" />
              Análises
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseManager />
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizManager />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Active Users */}
              {dashboard && dashboard.active_users && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                      Usuários Mais Ativos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboard.active_users.map((user, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-blue-500 text-white">
                              #{index + 1}
                            </Badge>
                            <span className="text-white">{user.username}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400">Nível {user.level}</span>
                            <span className="text-orange-500 font-medium">{user.points} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Platform Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Estatísticas Gerais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total de Lições</span>
                        <span className="text-white font-medium">
                          {dashboard?.statistics?.total_lessons || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lições Completadas</span>
                        <span className="text-white font-medium">
                          {dashboard?.statistics?.completed_lessons || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quizzes Realizados</span>
                        <span className="text-white font-medium">
                          {dashboard?.statistics?.quiz_attempts || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Engajamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Usuários Ativos Hoje</span>
                        <span className="text-white font-medium">
                          {dashboard?.statistics?.active_today || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Média de Pontos</span>
                        <span className="text-white font-medium">
                          {Math.round(dashboard?.statistics?.average_points || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Taxa de Conclusão</span>
                        <span className="text-white font-medium">
                          {Math.round(dashboard?.statistics?.completion_rate || 0)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;

