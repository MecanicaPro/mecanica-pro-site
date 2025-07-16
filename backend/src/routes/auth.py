from flask import Blueprint, request, jsonify, session
from src.models.user import db, User, UserProfile
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email e password são obrigatórios'}), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username já existe'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já existe'}), 400
        
        # Criar novo usuário
        user = User(
            username=data['username'],
            email=data['email'],
            user_type=data.get('user_type', 'student')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Criar perfil do usuário
        profile = UserProfile(user_id=user.id)
        db.session.add(profile)
        db.session.commit()
        
        # Fazer login automático
        session['user_id'] = user.id
        session['user_type'] = user.user_type
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict(),
            'profile': profile.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username e password são obrigatórios'}), 400
        
        # Buscar usuário
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Atualizar último login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Criar sessão
        session['user_id'] = user.id
        session['user_type'] = user.user_type
        
        # Buscar perfil
        profile = UserProfile.query.filter_by(user_id=user.id).first()
        if not profile:
            profile = UserProfile(user_id=user.id)
            db.session.add(profile)
            db.session.commit()
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'user': user.to_dict(),
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            profile = UserProfile(user_id=user_id)
            db.session.add(profile)
            db.session.commit()
        
        return jsonify({
            'user': user.to_dict(),
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check', methods=['GET'])
def check_auth():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({'authenticated': True, 'user': user.to_dict()}), 200
    
    return jsonify({'authenticated': False}), 200

