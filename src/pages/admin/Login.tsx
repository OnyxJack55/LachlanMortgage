import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import PageTitle from '../../components/PageTitle';
import * as authService from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setError(undefined);
    setIsLoading(true);
    try {
      await authService.login(credentials.email.trim(), credentials.password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Admin Login - Lachlan Mortgage" />
      <LoginForm onLogin={handleLogin} error={error} isLoading={isLoading} />
    </>
  );
};

export default Login; 