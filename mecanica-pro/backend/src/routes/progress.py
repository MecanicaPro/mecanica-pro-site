from flask import Blueprint, request, jsonify, session
from src.models.user import db, User, UserProfile, UserProgress, Lesson, Course
from sqlalchemy import func, desc
from datetime import datetime, timedelta

progress_bp = Blueprint('progress', __name__)

@progress_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Perfil não encontrado'}), 404
        
        # Progresso de hoje
        today = datetime.utcnow().date()
        today_progress = UserProgress.query.filter(
            UserProgress.user_id == user_id,
            func.date(UserProgress.completed_at) == today
        ).count()
        
        # Total de lições disponíveis
        total_lessons = Lesson.query.count()
        
        # Progresso geral
        completed_lessons = UserProgress.query.filter_by(user_id=user_id).count()
        
        # Calcular porcentagem de progresso
        progress_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        
        # Pontos para próximo nível
        current_points = profile.points
        next_level_points = get_points_for_level(profile.level + 1)
        points_to_next_level = next_level_points - current_points
        
        dashboard_data = {
            'user_profile': profile.to_dict(),
            'today_progress': {
                'lessons_completed': today_progress,
                'target_lessons': 3  # Meta diária
            },
            'overall_progress': {
                'completed_lessons': completed_lessons,
                'total_lessons': total_lessons,
                'progress_percentage': round(progress_percentage, 1)
            },
            'level_progress': {
                'current_level': profile.level,
                'current_points': current_points,
                'points_to_next_level': max(0, points_to_next_level),
                'next_level_points': next_level_points
            },
            'quiz_performance': {
                'average_score': round(profile.total_quiz_score, 1),
                'total_quizzes': 0  # TODO: implementar contador de quizzes
            }
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@progress_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        # Top 10 usuários por pontos
        top_users = db.session.query(
            User.username,
            UserProfile.points,
            UserProfile.level,
            UserProfile.total_lessons_completed
        ).join(UserProfile).order_by(desc(UserProfile.points)).limit(10).all()
        
        leaderboard = []
        for i, (username, points, level, lessons) in enumerate(top_users, 1):
            leaderboard.append({
                'rank': i,
                'username': username,
                'points': points,
                'level': level,
                'lessons_completed': lessons
            })
        
        # Posição do usuário atual
        user_id = session.get('user_id')
        user_rank = None
        if user_id:
            user_profile = UserProfile.query.filter_by(user_id=user_id).first()
            if user_profile:
                higher_users = UserProfile.query.filter(
                    UserProfile.points > user_profile.points
                ).count()
                user_rank = higher_users + 1
        
        return jsonify({
            'leaderboard': leaderboard,
            'user_rank': user_rank
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@progress_bp.route('/stats', methods=['GET'])
def get_user_stats():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Perfil não encontrado'}), 404
        
        # Estatísticas por categoria
        category_stats = db.session.query(
            Course.category,
            func.count(UserProgress.id).label('completed_lessons')
        ).join(Lesson).join(UserProgress).filter(
            UserProgress.user_id == user_id
        ).group_by(Course.category).all()
        
        # Progresso nos últimos 7 dias
        week_ago = datetime.utcnow() - timedelta(days=7)
        daily_progress = db.session.query(
            func.date(UserProgress.completed_at).label('date'),
            func.count(UserProgress.id).label('lessons')
        ).filter(
            UserProgress.user_id == user_id,
            UserProgress.completed_at >= week_ago
        ).group_by(func.date(UserProgress.completed_at)).all()
        
        stats = {
            'profile': profile.to_dict(),
            'category_progress': [
                {'category': cat, 'completed_lessons': count}
                for cat, count in category_stats
            ],
            'daily_progress': [
                {'date': date.isoformat(), 'lessons': lessons}
                for date, lessons in daily_progress
            ]
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_points_for_level(level):
    """Calcula os pontos necessários para um nível específico"""
    if level <= 1:
        return 0
    elif level == 2:
        return 500
    elif level == 3:
        return 1200
    elif level == 4:
        return 2000
    elif level == 5:
        return 3000
    elif level == 6:
        return 4500
    elif level == 7:
        return 6500
    elif level == 8:
        return 9000
    elif level == 9:
        return 12000
    elif level == 10:
        return 16000
    else:
        return 16000 + (level - 10) * 5000

