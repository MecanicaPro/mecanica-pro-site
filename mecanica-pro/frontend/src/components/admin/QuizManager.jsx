import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Brain, 
  Save,
  X,
  Clock,
  Star
} from 'lucide-react';

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_limit: '',
    points_reward: 10,
    questions: [
      {
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0
      }
    ]
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/admin/quizzes');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingQuiz 
        ? `/api/admin/quizzes/${editingQuiz.id}`
        : '/api/admin/quizzes';
      
      const method = editingQuiz ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        setShowForm(false);
        setEditingQuiz(null);
        resetForm();
        fetchQuizzes();
      } else {
        setMessage(data.error);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao salvar quiz');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time_limit: '',
      points_reward: 10,
      questions: [
        {
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0
        }
      ]
    });
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.time_limit || '',
      points_reward: quiz.points_reward,
      questions: quiz.questions || [
        {
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0
        }
      ]
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuiz(null);
    resetForm();
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex][field] = value;
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'Sem limite';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (loading && quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gerenciar Quizzes</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Quiz
        </Button>
      </div>

      {/* Messages */}
      {message && (
        <Alert className={`${messageType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <AlertDescription className={messageType === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time_limit" className="text-white">Tempo Limite (segundos)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData({...formData, time_limit: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Deixe vazio para sem limite"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points_reward" className="text-white">Pontos de Recompensa</Label>
                <Input
                  id="points_reward"
                  type="number"
                  value={formData.points_reward}
                  onChange={(e) => setFormData({...formData, points_reward: parseInt(e.target.value)})}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  required
                />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-lg">Questões</Label>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="sm"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Adicionar Questão
                  </Button>
                </div>

                {formData.questions.map((question, questionIndex) => (
                  <Card key={questionIndex} className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">Questão {questionIndex + 1}</h4>
                        {formData.questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(questionIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Pergunta</Label>
                        <Textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(questionIndex, 'question_text', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white">Opções de Resposta</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct_${questionIndex}`}
                              checked={question.correct_answer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                              className="text-green-500"
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder={`Opção ${optionIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                        <p className="text-sm text-gray-400">
                          Selecione o botão de rádio para marcar a resposta correta
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-purple-500 hover:bg-purple-600"
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-purple-500 text-white">
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
              <p className="text-gray-300 mb-4 line-clamp-3">
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

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(quiz)}
                  className="border-gray-600 text-gray-300 hover:bg-slate-700"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            Nenhum quiz encontrado
          </h3>
          <p className="text-gray-500">
            Clique em "Novo Quiz" para criar o primeiro quiz.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizManager;

