from flask import Blueprint, request, jsonify, session
from src.models.user import db, News
from datetime import datetime

news_bp = Blueprint('news', __name__)

@news_bp.route('/', methods=['GET'])
def get_news():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        news_query = News.query.filter_by(is_published=True).order_by(News.created_at.desc())
        news_pagination = news_query.paginate(page=page, per_page=per_page, error_out=False)
        
        news_list = []
        for news_item in news_pagination.items:
            news_dict = news_item.to_dict()
            news_list.append(news_dict)
        
        return jsonify({
            'news': news_list,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': news_pagination.total,
                'pages': news_pagination.pages,
                'has_next': news_pagination.has_next,
                'has_prev': news_pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/<int:news_id>', methods=['GET'])
def get_news_item(news_id):
    try:
        news_item = News.query.get_or_404(news_id)
        
        if not news_item.is_published:
            return jsonify({'error': 'Notícia não encontrada'}), 404
        
        return jsonify(news_item.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/latest', methods=['GET'])
def get_latest_news():
    try:
        limit = request.args.get('limit', 5, type=int)
        
        latest_news = News.query.filter_by(is_published=True).order_by(
            News.created_at.desc()
        ).limit(limit).all()
        
        return jsonify([news.to_dict() for news in latest_news]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

