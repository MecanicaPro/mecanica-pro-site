from flask import Blueprint, request, jsonify, session
from src.models.user import db, User, Course, Lesson, Quiz, News, UserProfile
from datetime import datetime
import json

admin_bp = Blueprint('admin', __name__)

def require_admin():
    """Decorator para verificar se o usuário é admin"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Usuário não autenticado'}), 401
    
    user = User.query.get(user_id)
    if not user or user.user_type != 'admin':
        return jsonify({'error': 'Acesso negado. Apenas administradores.'}), 403
    
    return None

# CURSOS
@admin_bp.route('/courses', methods=['POST'])
def create_course():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        data = request.get_json()
        
        course = Course(
            title=data['title'],
            description=data.get('description', ''),
            category=data.get('category', ''),
            difficulty_level=data.get('difficulty_level', 'beginner'),
            created_by=session.get('user_id')
        )
        
        db.session.add(course)
        db.session.commit()
        
        return jsonify({
            'message': 'Curso criado com sucesso',
            'course': course.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        course = Course.query.get_or_404(course_id)
        data = request.get_json()
        
        course.title = data.get('title', course.title)
        course.description = data.get('description', course.description)
        course.category = data.get('category', course.category)
        course.difficulty_level = data.get('difficulty_level', course.difficulty_level)
        course.is_active = data.get('is_active', course.is_active)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Curso atualizado com sucesso',
            'course': course.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# LIÇÕES
@admin_bp.route('/lessons', methods=['POST'])
def create_lesson():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        data = request.get_json()
        
        lesson = Lesson(
            course_id=data['course_id'],
            title=data['title'],
            content=data.get('content', ''),
            order_index=data.get('order_index', 0),
            points_reward=data.get('points_reward', 50)
        )
        
        # Adicionar slides se fornecidos
        if 'slides' in data:
            lesson.set_slides(data['slides'])
        
        db.session.add(lesson)
        db.session.commit()
        
        return jsonify({
            'message': 'Lição criada com sucesso',
            'lesson': lesson.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/lessons/<int:lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        lesson = Lesson.query.get_or_404(lesson_id)
        data = request.get_json()
        
        lesson.title = data.get('title', lesson.title)
        lesson.content = data.get('content', lesson.content)
        lesson.order_index = data.get('order_index', lesson.order_index)
        lesson.points_reward = data.get('points_reward', lesson.points_reward)
        
        if 'slides' in data:
            lesson.set_slides(data['slides'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Lição atualizada com sucesso',
            'lesson': lesson.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# QUIZZES
@admin_bp.route('/quizzes', methods=['POST'])
def create_quiz():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        data = request.get_json()
        
        quiz = Quiz(
            lesson_id=data.get('lesson_id'),
            title=data['title'],
            description=data.get('description', ''),
            points_reward=data.get('points_reward', 100),
            time_limit=data.get('time_limit')
        )
        
        # Adicionar questões
        if 'questions' in data:
            quiz.set_questions(data['questions'])
        
        db.session.add(quiz)
        db.session.commit()
        
        return jsonify({
            'message': 'Quiz criado com sucesso',
            'quiz': quiz.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/quizzes/<int:quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        quiz = Quiz.query.get_or_404(quiz_id)
        data = request.get_json()
        
        quiz.title = data.get('title', quiz.title)
        quiz.description = data.get('description', quiz.description)
        quiz.points_reward = data.get('points_reward', quiz.points_reward)
        quiz.time_limit = data.get('time_limit', quiz.time_limit)
        
        if 'questions' in data:
            quiz.set_questions(data['questions'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Quiz atualizado com sucesso',
            'quiz': quiz.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# NOTÍCIAS
@admin_bp.route('/news', methods=['POST'])
def create_news():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        data = request.get_json()
        
        news = News(
            title=data['title'],
            content=data.get('content', ''),
            media_type=data.get('media_type', 'text'),
            media_url=data.get('media_url'),
            created_by=session.get('user_id'),
            is_published=data.get('is_published', True)
        )
        
        db.session.add(news)
        db.session.commit()
        
        return jsonify({
            'message': 'Notícia criada com sucesso',
            'news': news.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/news/<int:news_id>', methods=['PUT'])
def update_news(news_id):
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        news = News.query.get_or_404(news_id)
        data = request.get_json()
        
        news.title = data.get('title', news.title)
        news.content = data.get('content', news.content)
        news.media_type = data.get('media_type', news.media_type)
        news.media_url = data.get('media_url', news.media_url)
        news.is_published = data.get('is_published', news.is_published)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Notícia atualizada com sucesso',
            'news': news.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DASHBOARD ADMINISTRATIVO
@admin_bp.route('/dashboard', methods=['GET'])
def admin_dashboard():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        # Estatísticas gerais
        total_users = User.query.filter_by(user_type='student').count()
        total_courses = Course.query.count()
        total_lessons = Lesson.query.count()
        total_quizzes = Quiz.query.count()
        
        # Usuários mais ativos
        active_users = db.session.query(
            User.username,
            UserProfile.points,
            UserProfile.level
        ).join(UserProfile).order_by(UserProfile.points.desc()).limit(5).all()
        
        dashboard_data = {
            'statistics': {
                'total_users': total_users,
                'total_courses': total_courses,
                'total_lessons': total_lessons,
                'total_quizzes': total_quizzes
            },
            'active_users': [
                {'username': username, 'points': points, 'level': level}
                for username, points, level in active_users
            ]
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# LISTAR CONTEÚDO PARA ADMINISTRAÇÃO
@admin_bp.route('/courses', methods=['GET'])
def list_courses_admin():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        courses = Course.query.all()
        return jsonify([course.to_dict() for course in courses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/lessons', methods=['GET'])
def list_lessons_admin():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        lessons = Lesson.query.all()
        return jsonify([lesson.to_dict() for lesson in lessons]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/quizzes', methods=['GET'])
def list_quizzes_admin():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        quizzes = Quiz.query.all()
        return jsonify([quiz.to_dict() for quiz in quizzes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/news', methods=['GET'])
def list_news_admin():
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    try:
        news = News.query.all()
        return jsonify([news_item.to_dict() for news_item in news]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

