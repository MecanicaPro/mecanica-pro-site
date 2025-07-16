from src.models.user import db, User, UserProfile, Course, Lesson, Quiz, News, Achievement
import json

def create_initial_data():
    """Cria dados iniciais se não existirem"""
    
    # Verificar se já existem dados
    if User.query.first():
        return
    
    try:
        # Criar usuário administrador
        admin = User(
            username='admin',
            email='admin@mecanicapro.com',
            user_type='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        
        # Criar perfil do admin
        admin_profile = UserProfile(user_id=admin.id, points=10000, level=10)
        db.session.add(admin_profile)
        
        # Criar usuário de exemplo
        demo_user = User(
            username='aluno_demo',
            email='aluno@demo.com',
            user_type='student'
        )
        demo_user.set_password('demo123')
        db.session.add(demo_user)
        db.session.commit()
        
        # Criar perfil do usuário demo
        demo_profile = UserProfile(user_id=demo_user.id, points=1250, level=8, total_lessons_completed=8)
        db.session.add(demo_profile)
        
        # Criar cursos
        courses_data = [
            {
                'title': 'Fundamentos dos Motores',
                'description': 'Aprenda os conceitos básicos sobre motores de combustão interna',
                'category': 'Motores',
                'difficulty_level': 'beginner'
            },
            {
                'title': 'Sistema de Freios',
                'description': 'Entenda como funcionam os sistemas de freios automotivos',
                'category': 'Freios',
                'difficulty_level': 'intermediate'
            },
            {
                'title': 'Elétrica Automotiva',
                'description': 'Domine os sistemas elétricos dos veículos modernos',
                'category': 'Elétrica',
                'difficulty_level': 'advanced'
            }
        ]
        
        courses = []
        for course_data in courses_data:
            course = Course(
                title=course_data['title'],
                description=course_data['description'],
                category=course_data['category'],
                difficulty_level=course_data['difficulty_level'],
                created_by=admin.id
            )
            db.session.add(course)
            courses.append(course)
        
        db.session.commit()
        
        # Criar lições para o curso de Motores
        motor_lessons = [
            {
                'title': 'Introdução aos Motores de Combustão',
                'content': 'Nesta lição você aprenderá os conceitos básicos sobre motores de combustão interna.',
                'slides': [
                    {'type': 'title', 'content': 'Motores de Combustão Interna'},
                    {'type': 'text', 'content': 'Um motor de combustão interna é uma máquina térmica que converte energia química em energia mecânica.'},
                    {'type': 'image', 'content': 'Diagrama básico de um motor 4 tempos'},
                    {'type': 'text', 'content': 'Os principais componentes incluem: pistões, bielas, virabrequim, válvulas e sistema de ignição.'}
                ],
                'order_index': 1,
                'points_reward': 75
            },
            {
                'title': 'Ciclo de 4 Tempos',
                'content': 'Entenda como funciona o ciclo de quatro tempos: admissão, compressão, combustão e escape.',
                'slides': [
                    {'type': 'title', 'content': 'Ciclo de 4 Tempos'},
                    {'type': 'text', 'content': '1º Tempo - Admissão: O pistão desce e a válvula de admissão se abre'},
                    {'type': 'text', 'content': '2º Tempo - Compressão: O pistão sobe comprimindo a mistura ar-combustível'},
                    {'type': 'text', 'content': '3º Tempo - Combustão: A vela de ignição gera a faísca e o pistão desce'},
                    {'type': 'text', 'content': '4º Tempo - Escape: O pistão sobe e a válvula de escape se abre'}
                ],
                'order_index': 2,
                'points_reward': 100
            }
        ]
        
        for lesson_data in motor_lessons:
            lesson = Lesson(
                course_id=courses[0].id,
                title=lesson_data['title'],
                content=lesson_data['content'],
                order_index=lesson_data['order_index'],
                points_reward=lesson_data['points_reward']
            )
            lesson.set_slides(lesson_data['slides'])
            db.session.add(lesson)
        
        # Criar lições para o curso de Freios
        brake_lessons = [
            {
                'title': 'Tipos de Sistemas de Freio',
                'content': 'Conheça os diferentes tipos de sistemas de freio utilizados em veículos.',
                'slides': [
                    {'type': 'title', 'content': 'Sistemas de Freio'},
                    {'type': 'text', 'content': 'Freios a disco: Mais eficientes, usados principalmente nas rodas dianteiras'},
                    {'type': 'text', 'content': 'Freios a tambor: Mais econômicos, comuns nas rodas traseiras'},
                    {'type': 'text', 'content': 'Sistema ABS: Previne o travamento das rodas durante frenagens bruscas'}
                ],
                'order_index': 1,
                'points_reward': 80
            }
        ]
        
        for lesson_data in brake_lessons:
            lesson = Lesson(
                course_id=courses[1].id,
                title=lesson_data['title'],
                content=lesson_data['content'],
                order_index=lesson_data['order_index'],
                points_reward=lesson_data['points_reward']
            )
            lesson.set_slides(lesson_data['slides'])
            db.session.add(lesson)
        
        db.session.commit()
        
        # Criar quizzes
        quiz_data = [
            {
                'title': 'Quiz: Fundamentos dos Motores',
                'description': 'Teste seus conhecimentos sobre motores de combustão interna',
                'questions': [
                    {
                        'question': 'Quantos tempos tem um motor de combustão interna convencional?',
                        'options': ['2 tempos', '4 tempos', '6 tempos', '8 tempos'],
                        'correct_answer': 1,
                        'explanation': 'Um motor convencional opera em 4 tempos: admissão, compressão, combustão e escape.'
                    },
                    {
                        'question': 'Qual é a função do pistão no motor?',
                        'options': ['Gerar faísca', 'Comprimir a mistura', 'Resfriar o motor', 'Filtrar o ar'],
                        'correct_answer': 1,
                        'explanation': 'O pistão comprime a mistura ar-combustível e transmite a força da combustão.'
                    },
                    {
                        'question': 'Em que tempo ocorre a combustão?',
                        'options': ['1º tempo', '2º tempo', '3º tempo', '4º tempo'],
                        'correct_answer': 2,
                        'explanation': 'A combustão ocorre no 3º tempo, após a compressão da mistura.'
                    }
                ],
                'points_reward': 150,
                'time_limit': 300
            },
            {
                'title': 'Quiz: Sistemas de Freio',
                'description': 'Avalie seu conhecimento sobre sistemas de freio automotivos',
                'questions': [
                    {
                        'question': 'Qual tipo de freio é mais eficiente?',
                        'options': ['Freio a tambor', 'Freio a disco', 'Freio de mão', 'Freio motor'],
                        'correct_answer': 1,
                        'explanation': 'Freios a disco são mais eficientes devido à melhor dissipação de calor.'
                    },
                    {
                        'question': 'O que significa ABS?',
                        'options': ['Anti-lock Braking System', 'Automatic Brake System', 'Advanced Brake System', 'Air Brake System'],
                        'correct_answer': 0,
                        'explanation': 'ABS significa Anti-lock Braking System, sistema que previne o travamento das rodas.'
                    }
                ],
                'points_reward': 120,
                'time_limit': 240
            }
        ]
        
        for quiz_info in quiz_data:
            quiz = Quiz(
                title=quiz_info['title'],
                description=quiz_info['description'],
                points_reward=quiz_info['points_reward'],
                time_limit=quiz_info['time_limit']
            )
            quiz.set_questions(quiz_info['questions'])
            db.session.add(quiz)
        
        # Criar notícias de exemplo
        news_data = [
            {
                'title': 'Bem-vindos à Mecânica Pro!',
                'content': 'Estamos muito felizes em lançar nossa plataforma de ensino gamificado de mecânica automotiva. Prepare-se para uma jornada de aprendizado divertida e interativa!',
                'media_type': 'text',
                'created_by': admin.id
            },
            {
                'title': 'Novo Curso: Elétrica Automotiva',
                'content': 'Acabamos de lançar nosso curso mais avançado sobre sistemas elétricos automotivos. Ideal para quem quer se especializar na área!',
                'media_type': 'text',
                'created_by': admin.id
            },
            {
                'title': 'Dica: Manutenção Preventiva',
                'content': 'A manutenção preventiva é fundamental para a vida útil do seu veículo. Confira nosso vídeo sobre os principais pontos de atenção.',
                'media_type': 'youtube',
                'media_url': 'https://www.youtube.com/watch?v=exemplo',
                'created_by': admin.id
            }
        ]
        
        for news_info in news_data:
            news = News(
                title=news_info['title'],
                content=news_info['content'],
                media_type=news_info['media_type'],
                media_url=news_info.get('media_url'),
                created_by=news_info['created_by']
            )
            db.session.add(news)
        
        # Criar conquistas
        achievements_data = [
            {
                'name': 'Primeiro Passo',
                'description': 'Complete sua primeira lição',
                'icon': 'trophy',
                'condition_type': 'lessons_completed',
                'condition_value': 1
            },
            {
                'name': 'Estudante Dedicado',
                'description': 'Complete 5 lições',
                'icon': 'book',
                'condition_type': 'lessons_completed',
                'condition_value': 5
            },
            {
                'name': 'Quiz Master',
                'description': 'Acerte 100% em um quiz',
                'icon': 'star',
                'condition_type': 'quiz_perfect',
                'condition_value': 1
            },
            {
                'name': 'Especialista em Motores',
                'description': 'Complete o curso de Fundamentos dos Motores',
                'icon': 'engine',
                'condition_type': 'course_completed',
                'condition_value': 1
            }
        ]
        
        for achievement_info in achievements_data:
            achievement = Achievement(
                name=achievement_info['name'],
                description=achievement_info['description'],
                icon=achievement_info['icon'],
                condition_type=achievement_info['condition_type'],
                condition_value=achievement_info['condition_value']
            )
            db.session.add(achievement)
        
        db.session.commit()
        print("Dados iniciais criados com sucesso!")
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar dados iniciais: {e}")
        raise e

