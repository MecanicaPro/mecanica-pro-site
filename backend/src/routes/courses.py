from flask import Blueprint, request, jsonify, session
from src.models.user import db, Course, Lesson, UserProgress, UserProfile
from datetime import datetime

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.filter_by(is_active=True).all()
        user_id = session.get('user_id')
        
        courses_data = []
        for course in courses:
            course_dict = course.to_dict()
            
            # Se usuário logado, adicionar progresso
            if user_id:
                completed_lessons = UserProgress.query.filter_by(
                    user_id=user_id
                ).join(Lesson).filter(Lesson.course_id == course.id).count()
                
                course_dict['user_progress'] = {
                    'completed_lessons': completed_lessons,
                    'total_lessons': len(course.lessons),
                    'progress_percentage': (completed_lessons / len(course.lessons) * 100) if course.lessons else 0
                }
            
            courses_data.append(course_dict)
        
        return jsonify(courses_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@courses_bp.route('/<int:course_id>', methods=['GET'])
def get_course(course_id):
    try:
        course = Course.query.get_or_404(course_id)
        user_id = session.get('user_id')
        
        course_dict = course.to_dict()
        
        # Buscar lições do curso
        lessons = Lesson.query.filter_by(course_id=course_id).order_by(Lesson.order_index).all()
        lessons_data = []
        
        for lesson in lessons:
            lesson_dict = lesson.to_dict()
            
            # Se usuário logado, verificar se completou a lição
            if user_id:
                progress = UserProgress.query.filter_by(
                    user_id=user_id,
                    lesson_id=lesson.id
                ).first()
                
                lesson_dict['completed'] = progress is not None
                lesson_dict['completion_date'] = progress.completed_at.isoformat() if progress else None
                lesson_dict['points_earned'] = progress.points_earned if progress else 0
            
            lessons_data.append(lesson_dict)
        
        course_dict['lessons'] = lessons_data
        
        return jsonify(course_dict), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@courses_bp.route('/<int:course_id>/lessons/<int:lesson_id>', methods=['GET'])
def get_lesson(course_id, lesson_id):
    try:
        lesson = Lesson.query.filter_by(id=lesson_id, course_id=course_id).first_or_404()
        user_id = session.get('user_id')
        
        lesson_dict = lesson.to_dict()
        
        # Se usuário logado, verificar progresso
        if user_id:
            progress = UserProgress.query.filter_by(
                user_id=user_id,
                lesson_id=lesson_id
            ).first()
            
            lesson_dict['completed'] = progress is not None
            lesson_dict['completion_date'] = progress.completed_at.isoformat() if progress else None
            lesson_dict['points_earned'] = progress.points_earned if progress else 0
        
        return jsonify(lesson_dict), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@courses_bp.route('/<int:course_id>/lessons/<int:lesson_id>/complete', methods=['POST'])
def complete_lesson(course_id, lesson_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        lesson = Lesson.query.filter_by(id=lesson_id, course_id=course_id).first_or_404()
        
        # Verificar se já foi completada
        existing_progress = UserProgress.query.filter_by(
            user_id=user_id,
            lesson_id=lesson_id
        ).first()
        
        if existing_progress:
            return jsonify({'message': 'Lição já foi completada'}), 200
        
        # Criar progresso
        progress = UserProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            points_earned=lesson.points_reward
        )
        db.session.add(progress)
        
        # Atualizar perfil do usuário
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if profile:
            profile.points += lesson.points_reward
            profile.total_lessons_completed += 1
            profile.last_activity = datetime.utcnow()
            
            # Verificar se subiu de nível
            level_up = profile.update_level()
            
            db.session.commit()
            
            response_data = {
                'message': 'Lição completada com sucesso!',
                'points_earned': lesson.points_reward,
                'total_points': profile.points,
                'level': profile.level,
                'level_up': level_up
            }
            
            return jsonify(response_data), 200
        
        return jsonify({'error': 'Perfil do usuário não encontrado'}), 404
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

