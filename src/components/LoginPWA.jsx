import React, { useState } from 'react';
import { Sprout, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const LoginPWA = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? 'token?grant_type=password' : 'signup';
      const url = `${SUPABASE_URL}/auth/v1/${endpoint}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.access_token) {
          // Login bem-sucedido
          onLogin(data.user, data.access_token);
        } else {
          // Registro bem-sucedido
          setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
          setIsLogin(true);
        }
      } else {
        setError(data.error_description || data.msg || 'Erro desconhecido');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pwa-container">
      {/* Background Pattern */}
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <Sprout size={32} color="white" />
            </div>
            <h1 className="logo-text">VERT GROW</h1>
          </div>
          <p className="login-subtitle">Sistema de Gestão de Cultivo</p>
        </div>

        {/* Form Card */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
            </h2>
            <p className="card-description">
              {isLogin 
                ? 'Entre para continuar gerenciando seu cultivo' 
                : 'Comece sua jornada de cultivo conosco'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Alert Messages */}
            {error && (
              <div className="alert alert-error">
                <div className="alert-content">
                  <span className="alert-text">{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                <div className="alert-content">
                  <span className="alert-text">{success}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength="6"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Processando...
                </div>
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta'
              )}
            </button>

            {/* Switch Mode */}
            <div className="form-switch">
              {isLogin ? (
                <p className="switch-text">
                  Não tem conta?{' '}
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="switch-link"
                  >
                    Criar agora
                  </button>
                </p>
              ) : (
                <p className="switch-text">
                  Já tem conta?{' '}
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                      setSuccess('');
                    }}
                    className="switch-link"
                  >
                    Fazer login
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            Cultive com inteligência, cresça com propósito
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPWA;

