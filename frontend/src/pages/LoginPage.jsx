import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Lock, Wrench } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(loginData.username, loginData.password);
    
    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (registerData.password !== registerData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setMessageType('error');
      setLoading(false);
      return;
    }

    const result = await register(
      registerData.username, 
      registerData.email, 
      registerData.password
    );
    
    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MecânicaPro</h1>
              <p className="text-sm text-gray-400">Portal de Mecânica Automotiva</p>
            </div>
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Acesse sua conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="login" className="text-white">Entrar</TabsTrigger>
                <TabsTrigger value="register" className="text-white">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Usuário</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Digite seu usuário"
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username" className="text-white">Usuário</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-username"
                        type="text"
                        placeholder="Escolha um usuário"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-white">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Crie uma senha"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {message && (
              <Alert className={`mt-4 ${messageType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                <AlertDescription className={messageType === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-medium mb-2">Contas de Demonstração:</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <div><strong>Admin:</strong> admin / admin123</div>
                <div><strong>Aluno:</strong> aluno_demo / demo123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

