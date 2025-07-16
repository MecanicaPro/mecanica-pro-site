import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Newspaper, 
  Save,
  X,
  Calendar,
  ExternalLink,
  Play,
  Image
} from 'lucide-react';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media_type: 'text',
    media_url: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/admin/news');
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingNews 
        ? `/api/admin/news/${editingNews.id}`
        : '/api/admin/news';
      
      const method = editingNews ? 'PUT' : 'POST';

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
        setEditingNews(null);
        resetForm();
        fetchNews();
      } else {
        setMessage(data.error);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao salvar notícia');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      media_type: 'text',
      media_url: ''
    });
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      media_type: newsItem.media_type || 'text',
      media_url: newsItem.media_url || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Notícia excluída com sucesso');
        setMessageType('success');
        fetchNews();
      } else {
        setMessage('Erro ao excluir notícia');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao excluir notícia');
      setMessageType('error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'youtube':
        return <Play className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <Newspaper className="h-4 w-4" />;
    }
  };

  const getMediaTypeLabel = (mediaType) => {
    switch (mediaType) {
      case 'youtube':
        return 'YouTube';
      case 'link':
        return 'Link';
      case 'image':
        return 'Imagem';
      default:
        return 'Texto';
    }
  };

  if (loading && news.length === 0) {
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
        <h2 className="text-2xl font-bold text-white">Gerenciar Notícias</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Notícia
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
              <span>{editingNews ? 'Editar Notícia' : 'Nova Notícia'}</span>
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="content" className="text-white">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="media_type" className="text-white">Tipo de Mídia</Label>
                  <Select 
                    value={formData.media_type} 
                    onValueChange={(value) => setFormData({...formData, media_type: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Apenas Texto</SelectItem>
                      <SelectItem value="youtube">Vídeo YouTube</SelectItem>
                      <SelectItem value="link">Link Externo</SelectItem>
                      <SelectItem value="image">Imagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.media_type !== 'text' && (
                  <div className="space-y-2">
                    <Label htmlFor="media_url" className="text-white">
                      {formData.media_type === 'youtube' && 'URL do YouTube'}
                      {formData.media_type === 'link' && 'URL do Link'}
                      {formData.media_type === 'image' && 'URL da Imagem'}
                    </Label>
                    <Input
                      id="media_url"
                      type="url"
                      value={formData.media_url}
                      onChange={(e) => setFormData({...formData, media_url: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder={
                        formData.media_type === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                        formData.media_type === 'link' ? 'https://exemplo.com' :
                        'https://exemplo.com/imagem.jpg'
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600"
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

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  {getMediaIcon(item.media_type)}
                  <span className="ml-1">{getMediaTypeLabel(item.media_type)}</span>
                </Badge>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(item.created_at)}
                </div>
              </div>
              <CardTitle className="text-white text-lg">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {item.content}
              </p>
              
              {item.media_url && (
                <div className="mb-4">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center text-orange-500">
                      {getMediaIcon(item.media_type)}
                      <span className="text-sm ml-2">
                        {getMediaTypeLabel(item.media_type)} anexado
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="border-gray-600 text-gray-300 hover:bg-slate-700"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
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

      {news.length === 0 && !loading && (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-gray-500">
            Clique em "Nova Notícia" para criar a primeira notícia.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsManager;

