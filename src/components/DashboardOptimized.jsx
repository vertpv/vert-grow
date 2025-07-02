import React, { useState, useEffect, useCallback } from 'react';
import CardCarousel from './CardCarousel';
import { 
  Sprout, 
  Building, 
  Thermometer, 
  BarChart3, 
  Clock,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Bell,
  Zap,
  Eye,
  ArrowRight
} from 'lucide-react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const DashboardOptimized = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({
    totalPlantas: 0,
    totalTendas: 0,
    checkins: 0,
    plantasComProblemas: 0,
    plantasGerminacao: 0,
    plantasVegetativa: 0,
    plantasFloracao: 0,
    ultimoCheckin: null,
    ultimosCheckins: [], // Adicionando array de últimos check-ins
    proximasTarefas: [],
    alertasCriticos: [],
    statusGeral: 'good' // good, warning, critical
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  // Função para obter headers de autenticação
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('vert-grow-token');
    console.log('Dashboard: getAuthHeaders - Token encontrado:', token ? 'Sim' : 'Não');
    
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }, []);

  // Atualizar hora a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Carregar nome do usuário do onboarding
  useEffect(() => {
    const onboardingData = localStorage.getItem('vert-grow-onboarding');
    if (onboardingData) {
      try {
        const data = JSON.parse(onboardingData);
        setUserName(data.name || '');
      } catch (error) {
        console.error('Erro ao carregar dados do onboarding:', error);
      }
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    if (!user?.id) {
      console.log('Dashboard: loadStats - Usuário não autenticado');
      setLoading(false);
      return;
    }

    console.log('Dashboard: loadStats - Carregando estatísticas para user.id:', user.id);
    setLoading(true);

    try {
      const headers = getAuthHeaders();
      console.log('Dashboard: loadStats - Headers:', headers);

      // Carregar plantas
      console.log('Dashboard: Carregando plantas...');
      const plantasResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}&order=created_at.desc`, {
        headers: headers
      });
      
      if (!plantasResponse.ok) {
        const error = await plantasResponse.text();
        console.error('Dashboard: Erro ao carregar plantas:', plantasResponse.status, error);
        throw new Error(`Erro ao carregar plantas: ${plantasResponse.status}`);
      }
      
      const plantas = await plantasResponse.json();
      console.log('Dashboard: Plantas carregadas:', plantas.length, plantas);

      // Carregar tendas
      console.log('Dashboard: Carregando tendas...');
      const tendasResponse = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}&order=created_at.desc`, {
        headers: headers
      });
      
      if (!tendasResponse.ok) {
        const error = await tendasResponse.text();
        console.error('Dashboard: Erro ao carregar tendas:', tendasResponse.status, error);
        throw new Error(`Erro ao carregar tendas: ${tendasResponse.status}`);
      }
      
      const tendas = await tendasResponse.json();
      console.log('Dashboard: Tendas carregadas:', tendas.length, tendas);

      // Carregar check-ins com informações das plantas
      console.log('Dashboard: Carregando check-ins...');
      const checkinsResponse = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta?user_id=eq.${user.id}&order=created_at.desc&limit=10`, {
        headers: headers
      });
      
      let checkins = [];
      let ultimosCheckins = [];
      if (checkinsResponse.ok) {
        checkins = await checkinsResponse.json();
        ultimosCheckins = checkins.map(checkin => ({
          id: checkin.id,
          data_checkin: checkin.data || checkin.created_at,
          planta_strain: checkin.plantas?.strain || 'Planta removida',
          planta_fase: checkin.plantas?.fase_atual || 'desconhecida',
          tarefas_concluidas: Array.isArray(checkin.tarefas_concluidas) 
            ? checkin.tarefas_concluidas 
            : JSON.parse(checkin.tarefas_concluidas || '[]'),
          observacoes: checkin.observacoes,
          created_at: checkin.created_at
        }));
        console.log('Dashboard: Check-ins carregados:', checkins.length, ultimosCheckins);
      } else {
        console.warn('Dashboard: Erro ao carregar check-ins, continuando sem eles');
      }

      // Calcular estatísticas
      const totalPlantas = plantas.length;
      const totalTendas = tendas.length;
      
      // Plantas por fase
      const plantasGerminacao = plantas.filter(p => p.fase === 'germinacao').length;
      const plantasVegetativa = plantas.filter(p => p.fase === 'vegetativa').length;
      const plantasFloracao = plantas.filter(p => p.fase === 'floracao').length;

      // Plantas com problemas (sem check-in há mais de 7 dias)
      const agora = new Date();
      const plantasComProblemas = plantas.filter(planta => {
        if (!planta.ultimo_checkin) return true;
        const ultimoCheckin = new Date(planta.ultimo_checkin);
        const diasSemCheckin = (agora - ultimoCheckin) / (1000 * 60 * 60 * 24);
        return diasSemCheckin > 7;
      }).length;

      // Último check-in
      const ultimosCheckinsData = plantas
        .filter(p => p.ultimo_checkin)
        .map(p => new Date(p.ultimo_checkin))
        .sort((a, b) => b - a);
      const ultimoCheckin = ultimosCheckinsData.length > 0 ? ultimosCheckinsData[0] : null;

      // Gerar tarefas sugeridas baseadas nos dados
      const proximasTarefas = generateSuggestedTasks(plantas, tendas, plantasComProblemas);

      // Gerar alertas críticos
      const alertasCriticos = generateCriticalAlerts(plantas, tendas, plantasComProblemas);

      // Status geral
      let statusGeral = 'good';
      if (alertasCriticos.length > 0) statusGeral = 'critical';
      else if (plantasComProblemas > 0) statusGeral = 'warning';

      const newStats = {
        totalPlantas,
        totalTendas,
        checkins: checkins.length,
        plantasComProblemas,
        plantasGerminacao,
        plantasVegetativa,
        plantasFloracao,
        ultimoCheckin,
        ultimosCheckins, // Adicionando os últimos check-ins processados
        proximasTarefas,
        alertasCriticos,
        statusGeral
      };

      console.log('Dashboard: Estatísticas calculadas:', newStats);
      setStats(newStats);

    } catch (error) {
      console.error('Dashboard: Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, getAuthHeaders]);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id, loadStats]);

  const generateSuggestedTasks = (plantas, tendas, plantasComProblemas) => {
    const tasks = [];

    // Prioridade 1: Alertas críticos
    if (plantasComProblemas > 0) {
      tasks.push({
        id: 'check_problematic_plants',
        titulo: `${plantasComProblemas} plantas precisam de atenção`,
        descricao: 'Há mais de 7 dias sem check-in',
        prioridade: 'high',
        acao: () => onNavigate('plantas'),
        icon: AlertTriangle
      });
    }

    // Prioridade 2: Setup inicial
    if (tendas.length === 0) {
      tasks.push({
        id: 'setup_first_tent',
        titulo: 'Configure sua primeira tenda',
        descricao: 'Defina o espaço de cultivo',
        prioridade: 'medium',
        acao: () => onNavigate('tendas'),
        icon: Building
      });
    }

    if (plantas.length === 0 && tendas.length > 0) {
      tasks.push({
        id: 'add_first_plant',
        titulo: 'Adicione sua primeira planta',
        descricao: 'Comece seu cultivo',
        prioridade: 'medium',
        acao: () => onNavigate('plantas'),
        icon: Sprout
      });
    }

    // Prioridade 3: Monitoramento
    if (plantas.length > 0) {
      const agora = new Date();
      const plantasSemCheckinRecente = plantas.filter(planta => {
        if (!planta.ultimo_checkin) return true;
        const ultimoCheckin = new Date(planta.ultimo_checkin);
        const diasSemCheckin = (agora - ultimoCheckin) / (1000 * 60 * 60 * 24);
        return diasSemCheckin > 3;
      });

      if (plantasSemCheckinRecente.length > 0) {
        tasks.push({
          id: 'daily_checkin',
          titulo: 'Fazer check-in das plantas',
          descricao: `${plantasSemCheckinRecente.length} plantas aguardando`,
          prioridade: 'medium',
          acao: () => onNavigate('plantas'),
          icon: CheckCircle
        });
      }
    }

    // Prioridade 4: Otimização
    if (plantas.length > 0 && tendas.length > 0) {
      tasks.push({
        id: 'environmental_monitoring',
        titulo: 'Registrar dados ambientais',
        descricao: 'Monitore temperatura e umidade',
        prioridade: 'low',
        acao: () => onNavigate('ambiente'),
        icon: Thermometer
      });
    }

    return tasks.slice(0, 5); // Máximo 5 tarefas
  };

  const generateCriticalAlerts = (plantas, tendas, plantasComProblemas) => {
    const alerts = [];

    if (plantasComProblemas > 2) {
      alerts.push({
        id: 'multiple_problematic_plants',
        titulo: 'Múltiplas plantas em risco',
        descricao: `${plantasComProblemas} plantas sem cuidados há mais de 7 dias`,
        severity: 'critical',
        acao: () => onNavigate('relatorios')
      });
    }

    if (plantas.length > 0 && tendas.length === 0) {
      alerts.push({
        id: 'plants_without_tents',
        titulo: 'Plantas sem tenda configurada',
        descricao: 'Configure tendas para organizar melhor',
        severity: 'warning',
        acao: () => onNavigate('tendas')
      });
    }

    return alerts;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-optimized">
      {/* Header com Status e Hora - PRIORIDADE 1 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {userName ? `Olá, ${userName}!` : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: getStatusColor(stats.statusGeral) }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getStatusColor(stats.statusGeral) }}
              />
              {stats.statusGeral === 'good' && 'Tudo em ordem'}
              {stats.statusGeral === 'warning' && 'Atenção necessária'}
              {stats.statusGeral === 'critical' && 'Ação urgente'}
            </div>
          </div>
        </div>

        {/* Alertas Críticos - PRIORIDADE 1 */}
        {stats.alertasCriticos.length > 0 && (
          <div className="space-y-2 mb-4">
            {stats.alertasCriticos.map((alert) => (
              <div 
                key={alert.id}
                className="p-4 rounded-lg border-l-4 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                style={{ borderLeftColor: alert.severity === 'critical' ? '#ef4444' : '#f59e0b' }}
                onClick={alert.acao}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle 
                    size={20} 
                    color={alert.severity === 'critical' ? '#ef4444' : '#f59e0b'} 
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{alert.titulo}</div>
                    <div className="text-xs text-gray-600">{alert.descricao}</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estatísticas Principais - PRIORIDADE 2 */}
      <CardCarousel
        itemWidth={160}
        gap={12}
        className="mb-6"
        showArrows={false}
      >
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="text-center">
            <Sprout size={24} color="#22c55e" className="mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalPlantas}</div>
            <div className="text-sm text-gray-600">Plantas</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="text-center">
            <Building size={24} color="#3b82f6" className="mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalTendas}</div>
            <div className="text-sm text-gray-600">Tendas</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="text-center">
            <CheckCircle size={24} color="#22c55e" className="mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.checkins}</div>
            <div className="text-sm text-gray-600">Check-ins</div>
          </div>
        </div>

        {stats.plantasComProblemas > 0 && (
          <div className="bg-white rounded-lg border border-orange-200 p-4 shadow-sm">
            <div className="text-center">
              <AlertTriangle size={24} color="#f59e0b" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.plantasComProblemas}</div>
              <div className="text-sm text-gray-600">Atenção</div>
            </div>
          </div>
        )}
      </CardCarousel>

      {/* Tarefas Sugeridas - PRIORIDADE 2 */}
      {stats.proximasTarefas.length > 0 && (
        <div className="bg-white rounded-lg border p-6 shadow-sm mb-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Zap size={20} />
            Próximas Ações
          </h3>
          <div className="space-y-3">
            {stats.proximasTarefas.slice(0, 3).map((tarefa, index) => {
              const Icon = tarefa.icon;
              return (
                <button
                  key={tarefa.id}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={tarefa.acao}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${getPriorityColor(tarefa.prioridade)}20` }}
                    >
                      <Icon size={16} color={getPriorityColor(tarefa.prioridade)} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tarefa.titulo}</div>
                      <div className="text-xs text-gray-600">{tarefa.descricao}</div>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ações Rápidas - PRIORIDADE 3 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          className="bg-white rounded-lg border p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
          onClick={() => onNavigate('plantas')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Plus size={20} color="white" />
            </div>
            <div>
              <div className="font-medium text-sm">Nova Planta</div>
              <div className="text-xs text-gray-600">Adicionar</div>
            </div>
          </div>
        </button>

        <button
          className="bg-white rounded-lg border p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
          onClick={() => onNavigate('ambiente')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Thermometer size={20} color="white" />
            </div>
            <div>
              <div className="font-medium text-sm">Monitorar</div>
              <div className="text-xs text-gray-600">Ambiente</div>
            </div>
          </div>
        </button>
      </div>

      {/* Distribuição por Fase - PRIORIDADE 4 */}
      {stats.totalPlantas > 0 && (
        <div className="bg-white rounded-lg border p-6 shadow-sm mb-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp size={20} />
            Fases do Cultivo
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Germinação</span>
              <span className="font-medium">{stats.plantasGerminacao}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ 
                  width: stats.totalPlantas > 0 ? `${(stats.plantasGerminacao / stats.totalPlantas) * 100}%` : '0%' 
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Vegetativa</span>
              <span className="font-medium">{stats.plantasVegetativa}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ 
                  width: stats.totalPlantas > 0 ? `${(stats.plantasVegetativa / stats.totalPlantas) * 100}%` : '0%' 
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Floração</span>
              <span className="font-medium">{stats.plantasFloracao}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                style={{ 
                  width: stats.totalPlantas > 0 ? `${(stats.plantasFloracao / stats.totalPlantas) * 100}%` : '0%' 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Últimos Check-ins - PRIORIDADE 2 */}
      {stats.ultimosCheckins.length > 0 && (
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Últimos Check-ins
            </h3>
            <span className="text-sm text-gray-500">
              {stats.ultimosCheckins.length} registro{stats.ultimosCheckins.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.ultimosCheckins.map((checkin, index) => {
              const dataCheckin = new Date(checkin.data_checkin || checkin.created_at);
              const diasAtras = Math.floor((new Date() - dataCheckin) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={checkin.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">
                        {checkin.planta_strain}
                      </p>
                      <span className="text-xs text-gray-500">
                        {diasAtras === 0 ? 'Hoje' : 
                         diasAtras === 1 ? 'Ontem' : 
                         `${diasAtras} dias atrás`}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {checkin.tarefas_concluidas.slice(0, 3).map((tarefa, idx) => (
                        <span 
                          key={idx}
                          className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {tarefa}
                        </span>
                      ))}
                      {checkin.tarefas_concluidas.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{checkin.tarefas_concluidas.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {checkin.observacoes && (
                      <p className="text-xs text-gray-600 truncate">
                        {checkin.observacoes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <button 
              className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => onNavigate('plantas')}
            >
              Ver todas as plantas
              <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Estado Vazio - Primeira Experiência */}
      {stats.totalTendas === 0 && stats.totalPlantas === 0 && (
        <div className="bg-white rounded-lg border p-8 text-center shadow-sm">
          <Sprout size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="font-medium mb-2">Bem-vindo ao VERT GROW!</h3>
          <p className="text-gray-600 mb-6">
            Comece configurando sua primeira tenda de cultivo
          </p>
          <button 
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => onNavigate('tendas')}
          >
            <Plus size={16} className="inline mr-2" />
            Criar Primeira Tenda
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardOptimized;

