from flask import Blueprint, request, jsonify, session
from src.models.user import db, Quiz, UserProfile
from datetime import datetime

quizzes_bp = Blueprint('quizzes', __name__)

@quizzes_bp.route('/', methods=['GET'])
def get_quizzes():
    try:
        quizzes = Quiz.query.all()
        return jsonify([quiz.to_dict() for quiz in quizzes]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quizzes_bp.route('/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    try:
        quiz = Quiz.query.get_or_404(quiz_id)
        quiz_dict = quiz.to_dict()
        
        # Remover respostas corretas para o frontend
        questions = quiz_dict['questions']
        for question in questions:
            if 'correct_answer' in question:
                del question['correct_answer']
        
        return jsonify(quiz_dict), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quizzes_bp.route('/<int:quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        data = request.get_json()
        answers = data.get('answers', [])
        
        quiz = Quiz.query.get_or_404(quiz_id)
        questions = quiz.get_questions()
        
        # Calcular pontuação
        correct_answers = 0
        total_questions = len(questions)
        
        for i, question in enumerate(questions):
            if i < len(answers) and answers[i] == question.get('correct_answer'):
                correct_answers += 1
        
        score_percentage = (correct_answers / total_questions * 100) if total_questions > 0 else 0
        points_earned = int(quiz.points_reward * (score_percentage / 100))
        
        # Atualizar perfil do usuário
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if profile:
            profile.points += points_earned
            profile.total_quiz_score = (profile.total_quiz_score + score_percentage) / 2  # Média
            profile.last_activity = datetime.utcnow()
            
            # Verificar se subiu de nível
            level_up = profile.update_level()
            
            db.session.commit()
            
            # Determinar mensagem de parabéns
            congratulations_message = ""
            if score_percentage == 100:
                congratulations_message = "🎉 Perfeito! Você acertou todas as questões!"
            elif score_percentage >= 80:
                congratulations_message = "👏 Excelente! Você teve um ótimo desempenho!"
            elif score_percentage >= 60:
                congratulations_message = "👍 Bom trabalho! Continue assim!"
            else:
                congratulations_message = "💪 Continue estudando! Você vai melhorar!"
            
            response_data = {
                'score': score_percentage,
                'correct_answers': correct_answers,
                'total_questions': total_questions,
                'points_earned': points_earned,
                'total_points': profile.points,
                'level': profile.level,
                'level_up': level_up,
                'congratulations_message': congratulations_message
            }
            
            if level_up:
                response_data['level_up_message'] = f"🚀 Parabéns! Você subiu para o Nível {profile.level}!"
            
            return jsonify(response_data), 200
        
        return jsonify({'error': 'Perfil do usuário não encontrado'}), 404
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

