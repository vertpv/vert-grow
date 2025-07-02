import React, { useState, useEffect } from 'react';
import LayoutAntd from './components/LayoutAntd';
import LoginOptimized from './components/LoginOptimized';
import OnboardingWizard from './components/OnboardingWizard';
import DashboardOptimized from './components/DashboardOptimized';
import PlantasManagerRefactored from './components/PlantasManagerRefactored';
import TendasCultivoRefactored from './components/TendasCultivoRefactored';
import MonitoramentoAmbientalRefactored from './components/MonitoramentoAmbientalRefactored';
import RelatoriosNew from './components/RelatoriosNew';
import RelatoriosDetalhados from './components/RelatoriosDetalhados';
import NutricaoMineral from './components/NutricaoMineral';
import CalculadoraReceita from './components/CalculadoraReceita';
// import AIAssistant from './components/AIAssistant'; // Removido
import { checkOnboardingStatus, saveOnboardingData, createInitialData } from './utils/onboardingService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState({
    plantas: [],
    tendas: [],
    registrosAmbientais: [],
    checkins: []
  });

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("vert-grow-user");
    const savedToken = localStorage.getItem("vert-grow-token");
    console.log("App.js: useEffect - savedUser:", savedUser);
    console.log("App.js: useEffect - savedToken:", savedToken);
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        checkUserOnboarding(userData.id);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('vert-grow-user');
        localStorage.removeItem('vert-grow-token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const checkUserOnboarding = async (userId) => {
    try {
      const hasCompletedOnboarding = await checkOnboardingStatus(userId);
      setShowOnboarding(!hasCompletedOnboarding);
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error);
      setShowOnboarding(true); // Em caso de erro, mostrar onboarding
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    checkUserOnboarding(userData.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('vert-grow-user');
    localStorage.removeItem('vert-grow-token');
    localStorage.removeItem('vert-grow-onboarding');
    setUser(null);
    setActiveTab('dashboard');
    setShowOnboarding(false);
    // Forçar reload da página para limpar cache
    window.location.reload();
  };

  const handleOnboardingComplete = async (onboardingData) => {
    try {
      await saveOnboardingData(user.id, onboardingData);
      await createInitialData(user.id, onboardingData);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      alert('Erro ao salvar dados do onboarding. Tente novamente.');
    }
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const updateAppData = (newData) => {
    setAppData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando VERT GROW...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginOptimized onLogin={handleLogin} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingWizard 
        user={user} 
        onComplete={handleOnboardingComplete}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOptimized 
            user={user} 
            onNavigate={handleNavigate}
          />
        );
      case 'plantas':
        return (
          <PlantasManagerRefactored 
            user={user} 
            onDataUpdate={updateAppData}
          />
        );
      case 'tendas':
        return (
          <TendasCultivoRefactored 
            user={user} 
            onDataUpdate={updateAppData}
          />
        );
      case 'ambiente':
        return (
          <MonitoramentoAmbientalRefactored 
            user={user} 
            onDataUpdate={updateAppData}
          />
        );
      case 'relatorios':
        return <RelatoriosDetalhados user={user} />;
      case 'nutricao':
        return <NutricaoMineral user={user} />;
      case 'calculadora':
        return <CalculadoraReceita user={user} />;
      default:
        return (
          <DashboardOptimized 
            user={user} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <LayoutAntd 
      user={user} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </LayoutAntd>
  );
}

export default App;



