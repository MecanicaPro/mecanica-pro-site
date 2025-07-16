import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, ExternalLink, Play } from 'lucide-react';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news/');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'youtube':
        return <Play className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <Newspaper className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold mb-2">Notícias</h1>
          <p className="text-gray-400">
            Fique por dentro das últimas novidades do setor automotivo
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-orange-500 text-white">
                    {getMediaIcon(item.media_type)}
                    <span className="ml-1 capitalize">{item.media_type}</span>
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
                  <div className="mt-4">
                    {item.media_type === 'youtube' && (
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="flex items-center text-orange-500">
                          <Play className="h-4 w-4 mr-2" />
                          <span className="text-sm">Vídeo no YouTube</span>
                        </div>
                      </div>
                    )}
                    
                    {item.media_type === 'link' && (
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="flex items-center text-orange-500">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <span className="text-sm">Link externo</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-gray-500">
              As notícias aparecerão aqui quando forem publicadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;

