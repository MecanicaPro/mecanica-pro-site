# Mecânica Pro - Portal de Mecânica Automotiva

Um sistema completo de curso gamificado de mecânica automotiva, inspirado no Duolingo, com foco em tornar o aprendizado técnico acessível, divertido e envolvente.

## 🎯 Visão Geral

O Mecânica Pro é uma plataforma inovadora que transforma o ensino de mecânica automotiva em uma experiência gamificada, oferecendo:

- **Cursos Estruturados**: Trilhas de conhecimento organizadas por temas (Motores, Freios, Elétrica)
- **Sistema de Gamificação**: Pontos, níveis, conquistas e ranking em tempo real
- **Quizzes Interativos**: Avaliações com feedback imediato e recompensas
- **Painel Administrativo**: Gerenciamento completo de conteúdo
- **Notícias Automotivas**: Seção de atualizações do setor

## 🚀 Funcionalidades Principais

### Para Alunos
- ✅ Dashboard de progresso personalizado
- ✅ Sistema de pontuação e níveis
- ✅ Quizzes com feedback imediato
- ✅ Trilhas de conhecimento estruturadas
- ✅ Ranking global de usuários
- ✅ Conquistas e badges
- ✅ Notícias do setor automotivo

### Para Administradores
- ✅ CRUD completo de cursos e lições
- ✅ Criação de quizzes com questões múltipla escolha
- ✅ Gerenciamento de notícias (texto, YouTube, links, imagens)
- ✅ Dashboard com estatísticas detalhadas
- ✅ Controle de usuários e progresso
- ✅ Interface organizada com abas

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **SQLite**: Banco de dados relacional
- **Flask-CORS**: Suporte a requisições cross-origin

### Frontend
- **React**: Biblioteca JavaScript para UI
- **Vite**: Build tool e servidor de desenvolvimento
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI modernos
- **Lucide React**: Ícones vetoriais

## 📁 Estrutura do Projeto

```
mecanica-pro/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── user.py          # Modelos de dados
│   │   ├── routes/
│   │   │   ├── auth.py          # Autenticação
│   │   │   ├── courses.py       # Cursos e lições
│   │   │   ├── quizzes.py       # Quizzes e questões
│   │   │   ├── progress.py      # Progresso e estatísticas
│   │   │   ├── news.py          # Notícias
│   │   │   └── admin.py         # Administração
│   │   ├── utils/
│   │   │   └── seed_data.py     # Dados iniciais
│   │   └── main.py              # Aplicação principal
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Componentes administrativos
│   │   │   └── Navbar.jsx       # Navegação
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Contexto de autenticação
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Página inicial
│   │   │   ├── LoginPage.jsx    # Login/Registro
│   │   │   ├── CoursesPage.jsx  # Cursos
│   │   │   ├── QuizPage.jsx     # Quizzes
│   │   │   ├── NewsPage.jsx     # Notícias
│   │   │   └── AdminPage.jsx    # Administração
│   │   └── App.jsx              # Aplicação principal
│   └── package.json
└── README.md
```

## 🎮 Sistema de Gamificação

### Pontuação
- **Lição Completada**: 50 pontos
- **Quiz Completado**: 10-100 pontos (baseado na performance)
- **Primeiro Login do Dia**: 10 pontos

### Níveis
- **Nível 1**: 0-100 pontos
- **Nível 2**: 101-250 pontos
- **Nível 3**: 251-500 pontos
- **Nível 4**: 501-1000 pontos
- **Nível 5+**: +500 pontos por nível

### Conquistas
- 🏆 **Primeiro Passo**: Primeira lição completada
- 🧠 **Quiz Master**: 100% de acerto em um quiz
- 🔥 **Sequência**: 7 dias consecutivos de atividade
- ⭐ **Especialista**: Completar um curso inteiro

## 🚀 Como Executar

### Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

## 👥 Contas de Demonstração

### Administrador
- **Usuário**: admin
- **Senha**: admin123

### Aluno
- **Usuário**: aluno_demo
- **Senha**: demo123

## 📊 Dados Iniciais

O sistema vem com dados de exemplo pré-configurados:

### Cursos
1. **Fundamentos de Motores** (Iniciante)
2. **Sistema de Freios** (Intermediário)
3. **Elétrica Automotiva** (Avançado)

### Quizzes
- Quiz de Conhecimentos Básicos
- Avaliação de Motores
- Teste de Sistemas Elétricos

### Notícias
- Novidades do setor automotivo
- Tecnologias emergentes
- Dicas de manutenção

## 🎨 Design e UX

- **Paleta de Cores**: Azul escuro (#1e293b) e Laranja (#f97316)
- **Tipografia**: Fonte system padrão com hierarquia clara
- **Layout**: Responsivo para desktop e mobile
- **Componentes**: Modernos com hover states e transições
- **Navegação**: Intuitiva com indicadores visuais

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```bash
# Backend
FLASK_ENV=development
FLASK_DEBUG=True

# Frontend
VITE_API_URL=http://localhost:5000
```

### Portas Padrão
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 📈 Métricas e Analytics

O painel administrativo oferece insights sobre:
- Total de usuários registrados
- Cursos e lições criados
- Quizzes realizados
- Usuários mais ativos
- Taxa de conclusão de cursos
- Engajamento diário

## 🔒 Segurança

- Autenticação baseada em sessões
- Validação de dados no backend
- Proteção contra CORS
- Sanitização de inputs
- Controle de acesso por tipo de usuário

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **Sistema de Certificados**: Emissão automática ao completar cursos
2. **Fórum de Discussão**: Comunidade de alunos e especialistas
3. **Vídeo Aulas**: Integração com conteúdo multimídia
4. **App Mobile**: Versão nativa para iOS e Android
5. **Integração com APIs**: Dados em tempo real do setor automotivo

### Otimizações Técnicas
1. **Cache Redis**: Para melhor performance
2. **CDN**: Para entrega de conteúdo estático
3. **Testes Automatizados**: Cobertura completa
4. **CI/CD**: Pipeline de deploy automatizado
5. **Monitoramento**: Logs e métricas de performance

## 📞 Suporte

Para dúvidas ou sugestões sobre o projeto, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.

---

**Mecânica Pro** - Transformando o aprendizado de mecânica automotiva através da gamificação! 🚗⚙️

