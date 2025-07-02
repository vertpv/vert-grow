import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const DashboardBento = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({
    totalPlantas: 0,
    totalTendas: 0,
    plantasGerminacao: 0,
    plantasVegetativa: 0,
    plantasFloracao: 0,
    checkins: 0,
    plantasComProblemas: 0,
    ultimoCheckin: null,
    proximasTarefas: []
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadStats();
    
    // Atualizar horário a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
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
      const checkinsResponse = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta?select=*,plantas!inner(user_id)&plantas.user_id=eq.${user.id}&order=created_at.desc&limit=10`, {
        headers: getAuthHeaders()
      });
      const checkins = checkinsResponse.ok ? await checkinsResponse.json() : [];

      // Calcular estatísticas
      const plantasPorFase = plantas.reduce((acc, planta) => {
        acc[planta.fase_atual] = (acc[planta.fase_atual] || 0) + 1;
        return acc;
      }, {});

      // Plantas com problemas (sem check-in há mais de 7 dias)
      const hoje = new Date();
      const plantasComProblemas = plantas.filter(planta => {
        const ultimoCheckin = planta.ultimo_checkin ? new Date(planta.ultimo_checkin) : null;
        if (!ultimoCheckin) return true;
        const diasSemCheckin = Math.floor((hoje - ultimoCheckin) / (1000 * 60 * 60 * 24));
        return diasSemCheckin > 7;
      }).length;

      // Gerar sugestões de tarefas
      const proximasTarefas = gerarSugestoesTarefas(plantas, checkins);

      setStats({
        totalPlantas: plantas.length,
        totalTendas: tendas.length,
        plantasGerminacao: plantasPorFase.germinacao || 0,
        plantasVegetativa: plantasPorFase.vegetativa || 0,
        plantasFloracao: plantasPorFase.floracao || 0,
        checkins: checkins.length,
        plantasComProblemas,
        ultimoCheckin: checkins[0]?.created_at || null,
        proximasTarefas
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const gerarSugestoesTarefas = (plantas, checkins) => {
    const tarefas = [];
    const hoje = new Date();

    // Verificar plantas sem check-in recente
    plantas.forEach(planta => {
      const ultimoCheckin = planta.ultimo_checkin ? new Date(planta.ultimo_checkin) : null;
      const diasSemCheckin = ultimoCheckin 
        ? Math.floor((hoje - ultimoCheckin) / (1000 * 60 * 60 * 24))
        : 999;

      if (diasSemCheckin > 3) {
        tarefas.push({
          tipo: 'checkin',
          prioridade: diasSemCheckin > 7 ? 'alta' : 'media',
          titulo: `Check-in: ${planta.strain}`,
          descricao: `${diasSemCheckin === 999 ? 'Nunca' : diasSemCheckin + ' dias'} sem check-in`,
          acao: () => onNavigate('plantas')
        });
      }
    });

    // Sugerir monitoramento ambiental se não há registros recentes
    if (checkins.length === 0 || (checkins[0] && new Date(checkins[0].created_at) < new Date(Date.now() - 24 * 60 * 60 * 1000))) {
      tarefas.push({
        tipo: 'ambiente',
        prioridade: 'media',
        titulo: 'Registrar condições ambientais',
        descricao: 'Monitore temperatura e umidade',
        acao: () => onNavigate('ambiente')
      });
    }

    // Se não há plantas, sugerir adicionar
    if (plantas.length === 0) {
      tarefas.push({
        tipo: 'planta',
        prioridade: 'alta',
        titulo: 'Adicionar primeira planta',
        descricao: 'Comece seu cultivo',
        acao: () => onNavigate('plantas')
      });
    }

    // Se não há tendas, sugerir configurar
    if (plantas.length > 0 && !plantas.some(p => p.tenda_id)) {
      tarefas.push({
        tipo: 'tenda',
        prioridade: 'media',
        titulo: 'Configurar tenda de cultivo',
        descricao: 'Organize suas plantas',
        acao: () => onNavigate('tendas')
      });
    }

    return tarefas.slice(0, 3); // Máximo 3 tarefas
  };

  const formatDateTime = (date) => {
    return {
      date: date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'var(--destructive)';
      case 'media': return 'var(--warning)';
      default: return 'var(--primary)';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  const { date, time } = formatDateTime(currentTime);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header com data/hora */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="text-sm font-mono">{time}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <CardCarousel
        itemWidth={280}
        gap={16}
        className="mb-6"
      >
        {/* Card de Boas-vindas */}
        <div 
          className="card card-elevated"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            color: 'white',
            border: 'none',
            minHeight: '160px'
          }}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Bem-vindo de volta!</h2>
                <p className="opacity-90">{user?.email}</p>
                <p className="text-sm opacity-75 mt-2">
                  {stats.totalPlantas > 0 
                    ? `Você tem ${stats.totalPlantas} plantas em cultivo`
                    : 'Pronto para começar seu cultivo?'
                  }
                </p>
              </div>
              <Sprout size={48} className="opacity-20" />
            </div>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="card card-elevated" style={{ minHeight: '160px' }}>
          <div className="card-content">
            <div className="flex items-center justify-between mb-3">
              <Sprout size={24} color="var(--primary)" />
              <span className="text-2xl font-bold">{stats.totalPlantas}</span>
            </div>
            <h3 className="font-semibold">Total de Plantas</h3>
            <p className="text-sm text-muted-foreground">
              {stats.plantasComProblemas > 0 
                ? `${stats.plantasComProblemas} precisam atenção`
                : 'Todas saudáveis'
              }
            </p>
          </div>
        </div>

        <div className="card card-elevated" style={{ minHeight: '160px' }}>
          <div className="card-content">
            <div className="flex items-center justify-between mb-3">
              <Building size={24} color="var(--accent)" />
              <span className="text-2xl font-bold">{stats.totalTendas}</span>
            </div>
            <h3 className="font-semibold">Tendas Ativas</h3>
            <p className="text-sm text-muted-foreground">
              {stats.totalTendas > 0 ? 'Configuradas' : 'Nenhuma configurada'}
            </p>
          </div>
        </div>

        <div className="card card-elevated" style={{ minHeight: '160px' }}>
          <div className="card-content">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 size={24} color="var(--muted)" />
              <span className="text-2xl font-bold">{stats.checkins}</span>
            </div>
            <h3 className="font-semibold">Check-ins</h3>
            <p className="text-sm text-muted-foreground">
              {stats.ultimoCheckin 
                ? `Último: ${new Date(stats.ultimoCheckin).toLocaleDateString('pt-BR')}`
                : 'Nenhum ainda'
              }
            </p>
          </div>
        </div>
      </CardCarousel>

      {/* Distribuição por Fase */}
      <div className="card card-elevated mb-6">
        <div className="card-header">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp size={20} />
            Distribuição por Fase
          </h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.plantasGerminacao}</div>
              <div className="text-sm text-muted-foreground">Germinação</div>
              <div 
                className="w-full h-2 bg-secondary rounded-full mt-2"
              >
                <div 
                  className="h-full bg-success rounded-full"
                  style={{ 
                    width: stats.totalPlantas > 0 
                      ? `${(stats.plantasGerminacao / stats.totalPlantas) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.plantasVegetativa}</div>
              <div className="text-sm text-muted-foreground">Vegetativa</div>
              <div className="w-full h-2 bg-secondary rounded-full mt-2">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ 
                    width: stats.totalPlantas > 0 
                      ? `${(stats.plantasVegetativa / stats.totalPlantas) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.plantasFloracao}</div>
              <div className="text-sm text-muted-foreground">Floração</div>
              <div className="w-full h-2 bg-secondary rounded-full mt-2">
                <div 
                  className="h-full bg-warning rounded-full"
                  style={{ 
                    width: stats.totalPlantas > 0 
                      ? `${(stats.plantasFloracao / stats.totalPlantas) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas e Tarefas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tarefas Sugeridas */}
        <div className="card card-elevated">
          <div className="card-header">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle size={20} />
              Tarefas Sugeridas
            </h3>
          </div>
          <div className="card-content">
            {stats.proximasTarefas.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>Tudo em dia!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.proximasTarefas.map((tarefa, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                    onClick={tarefa.acao}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ backgroundColor: getPriorityColor(tarefa.prioridade) }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{tarefa.titulo}</div>
                        <div className="text-xs text-muted-foreground">{tarefa.descricao}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="space-y-4">
          <div className="card card-elevated">
            <div className="card-content">
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                onClick={() => onNavigate('plantas')}
              >
                <Plus size={20} />
                <div className="text-left">
                  <div className="font-medium">Nova Planta</div>
                  <div className="text-sm opacity-90">Adicionar ao cultivo</div>
                </div>
              </button>
            </div>
          </div>

          <div className="card card-elevated">
            <div className="card-content">
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity"
                onClick={() => onNavigate('ambiente')}
              >
                <Thermometer size={20} />
                <div className="text-left">
                  <div className="font-medium">Monitorar</div>
                  <div className="text-sm opacity-90">Ambiente</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBento;

