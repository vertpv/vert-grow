import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Divider,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginOptimized = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          }),
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
          localStorage.setItem('vert-grow-token', data.access_token);
          localStorage.setItem('vert-grow-user', JSON.stringify(data.user));
          onLogin(data.user, data.access_token);
        } else {
          setError(data.error_description || 'Credenciais inválidas');
        }
      } else {
        // Registro com confirmação automática
        const signupResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            data: { 
              name: values.name,
              email_confirm: true // Força confirmação automática
            },
            confirm: false // Desabilita necessidade de confirmação por email
          }),
        });

        const signupData = await signupResponse.json();

        if (signupResponse.ok) {
          // Após registro bem-sucedido, fazer login automaticamente
          const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password
            }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok && loginData.access_token) {
            localStorage.setItem('vert-grow-token', loginData.access_token);
            localStorage.setItem('vert-grow-user', JSON.stringify(loginData.user));
            onLogin(loginData.user, loginData.access_token);
          } else {
            // Se o login automático falhar, mostrar mensagem de sucesso e alternar para login
            setError('');
            setIsLogin(true);
            form.setFieldsValue({ email: values.email, password: values.password });
            // Tentar login novamente após um pequeno delay
            setTimeout(() => {
              form.submit();
            }, 1000);
          }
        } else {
          setError(signupData.error_description || 'Erro ao criar conta');
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    form.resetFields();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={8}>
          <Card
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: 'none',
              borderRadius: '16px'
            }}
            bodyStyle={{ padding: '48px 32px' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Header */}
              <div style={{ textAlign: 'center' }}>
                <Title 
                  level={1} 
                  style={{ 
                    color: '#22c55e', 
                    marginBottom: '8px',
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}
                >
                  VERT GROW
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Sistema de Gestão de Cultivo
                </Text>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ borderRadius: '8px' }}
                />
              )}

              {/* Form */}
              <Form
                form={form}
                name="auth"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
                requiredMark={false}
              >
                {!isLogin && (
                  <Form.Item
                    name="name"
                    label="Nome Completo"
                    rules={[
                      { required: true, message: 'Por favor, insira seu nome!' },
                      { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="Seu nome completo"
                      style={{ borderRadius: '8px' }}
                      autocomplete="name"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Email inválido!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="seu@email.com"
                    style={{ borderRadius: '8px' }}
                    autoComplete="email"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="Sua senha"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    style={{ borderRadius: '8px' }}
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: '16px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      background: '#22c55e',
                      borderColor: '#22c55e'
                    }}
                  >
                    {isLogin ? 'Entrar' : 'Criar Conta'}
                  </Button>
                </Form.Item>
              </Form>

              {/* Toggle Mode */}
              <div style={{ textAlign: 'center' }}>
                <Divider style={{ margin: '16px 0' }}>
                  <Text type="secondary">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  </Text>
                </Divider>
                <Button
                  type="link"
                  onClick={toggleMode}
                  style={{
                    padding: '0 8px',
                    color: '#22c55e',
                    fontWeight: '500'
                  }}
                >
                  {isLogin ? 'Criar conta' : 'Fazer login'}
                </Button>
              </div>

              {/* Info Card */}
              <Card
                size="small"
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px'
                }}
              >
                <Text style={{ fontSize: '12px', color: '#15803d' }}>
                  <strong>✅ Acesso Imediato:</strong> Não é necessário confirmar email. 
                  Sua conta será ativada automaticamente após o registro.
                </Text>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginOptimized;

