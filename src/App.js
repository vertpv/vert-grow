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
    console.log("App.js: useEffect - Iniciando verificação de login.");
    const savedUser = localStorage.getItem("vert-grow-user");
    const savedToken = localStorage.getItem("vert-grow-token");
    console.log("App.js: useEffect - savedUser:", savedUser);
    console.log("App.js: useEffect - savedToken:", savedToken);
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        console.log("App.js: useEffect - Usuário encontrado no localStorage:", userData);
        setUser(userData);
        checkUserOnboarding(userData.id);
      } catch (error) {
        console.error("App.js: Erro ao carregar dados do usuário do localStorage:", error);
        localStorage.removeItem("vert-grow-user");
        localStorage.removeItem("vert-grow-token");
        setLoading(false);
      }
    } else {
      console.log("App.js: useEffect - Nenhum usuário ou token encontrado no localStorage. Exibindo tela de login.");
      setLoading(false);
    }
  }, []);

  const checkUserOnboarding = async (userId) => {
    console.log("App.js: checkUserOnboarding - Verificando status do onboarding para userId:", userId);
    try {
      const hasCompletedOnboarding = await checkOnboardingStatus(userId);
      console.log("App.js: checkUserOnboarding - hasCompletedOnboarding:", hasCompletedOnboarding);
      setShowOnboarding(!hasCompletedOnboarding);
    } catch (error) {
      console.error("App.js: Erro ao verificar onboarding:", error);
      setShowOnboarding(true); // Em caso de erro, mostrar onboarding para garantir que o usuário possa tentar novamente
    } finally {
      console.log("App.js: checkUserOnboarding - Finalizando carregamento.");
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    console.log("App.js: handleLogin - Usuário logado:", userData);
    setUser(userData);
    checkUserOnboarding(userData.id);
  };

  const handleLogout = () => {
    console.log("App.js: handleLogout - Realizando logout.");
    localStorage.removeItem("vert-grow-user");
    localStorage.removeItem("vert-grow-token");
    localStorage.removeItem("vert-grow-onboarding");
    setUser(null);
    setActiveTab("dashboard");
    setShowOnboarding(false);
    window.location.reload();
  };

  const handleOnboardingComplete = async (onboardingData) => {
    console.log("App.js: handleOnboardingComplete - Onboarding concluído.");
    try {
      await saveOnboardingData(user.id, onboardingData);
      await createInitialData(user.id, onboardingData);
      setShowOnboarding(false);
    } catch (error) {
      console.error("App.js: Erro ao completar onboarding:", error);
      alert("Erro ao salvar dados do onboarding. Tente novamente.");
    }
  };

  const handleSkipOnboarding = async () => {
    console.log("App.js: handleSkipOnboarding - Onboarding pulado.");
    try {
      // Marcar onboarding como completo sem dados específicos
      await saveOnboardingData(user.id, { skipped: true });
      setShowOnboarding(false);
    } catch (error) {
      console.error("App.js: Erro ao pular onboarding:", error);
      alert("Erro ao pular onboarding. Tente novamente.");
    }
  };

  const handleNavigate = (tab) => {
    console.log("App.js: handleNavigate - Navegando para:", tab);
    setActiveTab(tab);
  };

  const updateAppData = (newData) => {
    console.log("App.js: updateAppData - Atualizando dados do aplicativo.", newData);
    setAppData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  console.log("App.js: Render - user:", user, "loading:", loading, "showOnboarding:", showOnboarding);

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
    console.log("App.js: Render - Exibindo LoginOptimized.");
    return <LoginOptimized onLogin={handleLogin} />;
  }

  if (showOnboarding) {
    console.log("App.js: Render - Exibindo OnboardingWizard.");
    return (
      <OnboardingWizard 
        user={user} 
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
        onLogout={handleLogout}
      />
    );
  }

  console.log("App.js: Render - Exibindo LayoutAntd com activeTab:", activeTab);
  return (
    <LayoutAntd 
      user={user}
      activeTab={activeTab}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && <DashboardOptimized user={user} appData={appData} />}
      {activeTab === 'plantas' && <PlantasManagerRefactored user={user} updateAppData={updateAppData} />}
      {activeTab === 'tendas' && <TendasCultivoRefactored user={user} updateAppData={updateAppData} />}
      {activeTab === 'monitoramento' && <MonitoramentoAmbientalRefactored user={user} updateAppData={updateAppData} />}
      {activeTab === 'relatorios' && <RelatoriosNew user={user} appData={appData} />}
      {activeTab === 'relatorios-detalhados' && <RelatoriosDetalhados user={user} appData={appData} />}
      {activeTab === 'nutricao' && <NutricaoMineral user={user} />}
      {activeTab === 'calculadora' && <CalculadoraReceita user={user} />}
    </LayoutAntd>
  );
}

export default App;



