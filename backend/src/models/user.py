from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.String(20), default='student')  # student, admin, instructor
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relacionamentos
    profile = db.relationship('UserProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    progress = db.relationship('UserProgress', backref='user', cascade='all, delete-orphan')
    achievements = db.relationship('UserAchievement', backref='user', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'user_type': self.user_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    total_lessons_completed = db.Column(db.Integer, default=0)
    total_quiz_score = db.Column(db.Float, default=0.0)
    badges_earned = db.Column(db.Text, default='[]')  # JSON array of badge IDs
    current_streak = db.Column(db.Integer, default=0)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)

    def get_badges(self):
        return json.loads(self.badges_earned) if self.badges_earned else []

    def add_badge(self, badge_id):
        badges = self.get_badges()
        if badge_id not in badges:
            badges.append(badge_id)
            self.badges_earned = json.dumps(badges)

    def calculate_level(self):
        # Sistema de níveis baseado em pontos
        if self.points < 500:
            return 1
        elif self.points < 1200:
            return 2
        elif self.points < 2000:
            return 3
        elif self.points < 3000:
            return 4
        elif self.points < 4500:
            return 5
        elif self.points < 6500:
            return 6
        elif self.points < 9000:
            return 7
        elif self.points < 12000:
            return 8
        elif self.points < 16000:
            return 9
        else:
            return 10 + (self.points - 16000) // 5000

    def update_level(self):
        new_level = self.calculate_level()
        if new_level > self.level:
            self.level = new_level
            return True  # Level up!
        return False

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'points': self.points,
            'level': self.level,
            'total_lessons_completed': self.total_lessons_completed,
            'total_quiz_score': self.total_quiz_score,
            'badges_earned': self.get_badges(),
            'current_streak': self.current_streak,
            'last_activity': self.last_activity.isoformat() if self.last_activity else None
        }

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))  # Motores, Freios, Elétrica, etc.
    difficulty_level = db.Column(db.String(20), default='beginner')  # beginner, intermediate, advanced
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    lessons = db.relationship('Lesson', backref='course', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'lesson_count': len(self.lessons)
        }

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    slides_data = db.Column(db.Text)  # JSON data for slides
    order_index = db.Column(db.Integer, default=0)
    points_reward = db.Column(db.Integer, default=50)
    
    # Relacionamentos
    progress = db.relationship('UserProgress', backref='lesson', cascade='all, delete-orphan')
    quizzes = db.relationship('Quiz', backref='lesson', cascade='all, delete-orphan')

    def get_slides(self):
        return json.loads(self.slides_data) if self.slides_data else []

    def set_slides(self, slides):
        self.slides_data = json.dumps(slides)

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'title': self.title,
            'content': self.content,
            'slides': self.get_slides(),
            'order_index': self.order_index,
            'points_reward': self.points_reward
        }

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=True)  # Pode ser independente
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    questions_data = db.Column(db.Text, nullable=False)  # JSON data for questions
    points_reward = db.Column(db.Integer, default=100)
    time_limit = db.Column(db.Integer)  # em segundos
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_questions(self):
        return json.loads(self.questions_data) if self.questions_data else []

    def set_questions(self, questions):
        self.questions_data = json.dumps(questions)

    def to_dict(self):
        return {
            'id': self.id,
            'lesson_id': self.lesson_id,
            'title': self.title,
            'description': self.description,
            'questions': self.get_questions(),
            'points_reward': self.points_reward,
            'time_limit': self.time_limit,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    points_earned = db.Column(db.Integer, default=0)
    quiz_score = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lesson_id': self.lesson_id,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'points_earned': self.points_earned,
            'quiz_score': self.quiz_score
        }

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    media_type = db.Column(db.String(20), default='text')  # text, youtube, image, link
    media_url = db.Column(db.String(500))
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_published = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'media_type': self.media_type,
            'media_url': self.media_url,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_published': self.is_published
        }

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(100))  # Nome do ícone
    points_required = db.Column(db.Integer, default=0)
    condition_type = db.Column(db.String(50))  # lessons_completed, quiz_perfect, streak, etc.
    condition_value = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'points_required': self.points_required,
            'condition_type': self.condition_type,
            'condition_value': self.condition_value
        }

class UserAchievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievement.id'), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'achievement_id': self.achievement_id,
            'earned_at': self.earned_at.isoformat() if self.earned_at else None
        }
