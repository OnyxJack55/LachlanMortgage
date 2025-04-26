import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import PageTitle from '../../components/PageTitle';
import authService from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const success = await authService.login(credentials.email.trim(), credentials.password);
      if (success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <>
      <PageTitle title="Admin Login - Lachlan Mortgage" />
      <LoginForm onLogin={handleLogin} />
    </>
  );
};

export default Login; 