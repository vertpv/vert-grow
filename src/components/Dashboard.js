import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalPlantas: 0,
    totalTendas: 0,
    plantasGerminacao: 0,
    plantasVegetativa: 0,
    plantasFloracao: 0,
    checkins: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);

  useEffect(() => {
    loadStats();
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('supabase_token');
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`
    };
  };

  const loadStats = async () => {
    try {
      if (!user?.id) return;

      // Carregar plantas
      const plantasResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      const plantas = plantasResponse.ok ? await plantasResponse.json() : [];

      // Carregar tendas
      const tendasResponse = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      const tendas = tendasResponse.ok ? await tendasResponse.json() : [];

      // Carregar checkins
      const checkinsResponse = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta?select=*,plantas!inner(user_id)&plantas.user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      const checkins = checkinsResponse.ok ? await checkinsResponse.json() : [];

      const plantasPorFase = plantas.reduce((acc, planta) => {
        acc[planta.fase_atual] = (acc[planta.fase_atual] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalPlantas: plantas.length,
        totalTendas: tendas.length,
        plantasGerminacao: plantasPorFase.germinacao || 0,
        plantasVegetativa: plantasPorFase.vegetativa || 0,
        plantasFloracao: plantasPorFase.floracao || 0,
        checkins: checkins.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFirstPlant = () => {
    // Redirecionar para a aba de plantas
    const event = new CustomEvent('changeTab', { detail: 'plantas' });
    window.dispatchEvent(event);
  };

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Bem-vindo de volta, {user?.email}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <h3>{stats.totalPlantas}</h3>
            <p>Total de Plantas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>{stats.totalTendas}</h3>
            <p>Tendas de Cultivo</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.checkins}</h3>
            <p>Check-ins Realizados</p>
          </div>
        </div>
      </div>

      <div className="fase-breakdown">
        <h3>Plantas por Fase</h3>
        <div className="fase-stats">
          <div className="fase-item">
            <span className="fase-badge germinacao">🌱 Germinação</span>
            <span className="fase-count">{stats.plantasGerminacao}</span>
          </div>
          <div className="fase-item">
            <span className="fase-badge vegetativa">🌿 Vegetativa</span>
            <span className="fase-count">{stats.plantasVegetativa}</span>
          </div>
          <div className="fase-item">
            <span className="fase-badge floracao">🌸 Floração</span>
            <span className="fase-count">{stats.plantasFloracao}</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="actions-grid">
          {stats.totalPlantas === 0 ? (
            <button 
              className="action-card primary"
              onClick={handleAddFirstPlant}
            >
              <div className="action-icon">🌱</div>
              <div className="action-content">
                <h4>Adicionar Primeira Planta</h4>
                <p>Comece seu cultivo adicionando sua primeira planta</p>
              </div>
            </button>
          ) : (
            <button 
              className="action-card"
              onClick={handleAddFirstPlant}
            >
              <div className="action-icon">🌱</div>
              <div className="action-content">
                <h4>Gerenciar Plantas</h4>
                <p>Adicionar novas plantas ou fazer check-ins</p>
              </div>
            </button>
          )}

          {stats.totalTendas === 0 ? (
            <button 
              className="action-card primary"
              onClick={() => {
                const event = new CustomEvent('changeTab', { detail: 'tendas' });
                window.dispatchEvent(event);
              }}
            >
              <div className="action-icon">🏠</div>
              <div className="action-content">
                <h4>Configurar Primeira Tenda</h4>
                <p>Configure sua tenda de cultivo</p>
              </div>
            </button>
          ) : (
            <button 
              className="action-card"
              onClick={() => {
                const event = new CustomEvent('changeTab', { detail: 'tendas' });
                window.dispatchEvent(event);
              }}
            >
              <div className="action-icon">🏠</div>
              <div className="action-content">
                <h4>Gerenciar Tendas</h4>
                <p>Configurar e monitorar suas tendas</p>
              </div>
            </button>
          )}

          <button 
            className="action-card"
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: 'ambiente' });
              window.dispatchEvent(event);
            }}
          >
            <div className="action-icon">🌡️</div>
            <div className="action-content">
              <h4>Monitorar Ambiente</h4>
              <p>Registrar temperatura e umidade</p>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: 'relatorios' });
              window.dispatchEvent(event);
            }}
          >
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h4>Ver Relatórios</h4>
              <p>Análise completa do seu cultivo</p>
            </div>
          </button>
        </div>
      </div>

      {stats.totalPlantas === 0 && stats.totalTendas === 0 && (
        <div className="welcome-message">
          <h3>🌿 Bem-vindo ao Vert Grow!</h3>
          <p>Para começar seu cultivo:</p>
          <ol>
            <li>Configure sua primeira tenda de cultivo</li>
            <li>Adicione suas plantas</li>
            <li>Monitore o ambiente</li>
            <li>Faça check-ins regulares</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

