import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  AlertTriangle,
  Clock,
  Target,
  Sprout,
  Droplets,
  Scissors,
  Eye,
  FileText,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoStat } from './ui/bento-grid';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const RelatoriosDetalhados = ({ user }) => {
  const [relatorios, setRelatorios] = useState({
    resumoGeral: {
      totalCheckins: 0,
      plantasAtivas: 0,
      mediaCheckinsSemanais: 0,
      ultimoCheckin: null,
      tendencia: 'stable' // up, down, stable
    },
    frequenciaCheckins: {
      ultimos7Dias: 0,
      ultimos30Dias: 0,
      porPlanta: []
    },
    tarefasPopulares: [],
    analiseTempoReal: {
      plantasComAtraso: [],
      plantasEmDia: [],
      recomendacoes: []
    },
    crescimentoPorFase: {
      germinacao: { plantas: 0, mediaCheckins: 0 },
      vegetativa: { plantas: 0, mediaCheckins: 0 },
      floracao: { plantas: 0, mediaCheckins: 0 }
    },
    insights: []
  });

  const [filtros, setFiltros] = useState({
    periodo: '30', // 7, 30, 90 dias
    planta: 'todas',
    fase: 'todas'
  });

  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para obter headers de autenticação
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('vert-grow-token');
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }, []);

  // Carregar dados para relatórios
  const carregarDados = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const diasFiltro = parseInt(filtros.periodo);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasFiltro);

      // Carregar plantas
      const plantasResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}&order=created_at.desc`, {
        headers: headers
      });
      
      if (!plantasResponse.ok) throw new Error('Erro ao carregar plantas');
      const plantasData = await plantasResponse.json();
      setPlantas(plantasData);

      // Carregar check-ins com filtro de período
      const checkinsResponse = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta?user_id=eq.${user.id}&created_at=gte.${dataLimite.toISOString()}&order=created_at.desc&select=*,plantas(strain,fase_atual)`, {
        headers: headers
      });
      
      if (!checkinsResponse.ok) throw new Error('Erro ao carregar check-ins');
      const checkinsData = await checkinsResponse.json();

      // Processar dados para relatórios
      const relatoriosProcessados = processarRelatorios(plantasData, checkinsData, diasFiltro);
      setRelatorios(relatoriosProcessados);

    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filtros.periodo, getAuthHeaders]);

  // Processar dados para gerar relatórios
  const processarRelatorios = (plantas, checkins, diasPeriodo) => {
    const agora = new Date();
    const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const umMesAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Resumo Geral
    const totalCheckins = checkins.length;
    const plantasAtivas = plantas.length;
    const checkinsUltimaSemana = checkins.filter(c => new Date(c.created_at) >= umaSemanaAtras).length;
    const mediaCheckinsSemanais = Math.round(checkinsUltimaSemana);
    const ultimoCheckin = checkins.length > 0 ? checkins[0].created_at : null;

    // Tendência (comparar última semana com semana anterior)
    const duasSemanasAtras = new Date(agora.getTime() - 14 * 24 * 60 * 60 * 1000);
    const checkinsSemanaAnterior = checkins.filter(c => {
      const data = new Date(c.created_at);
      return data >= duasSemanasAtras && data < umaSemanaAtras;
    }).length;
    
    let tendencia = 'stable';
    if (checkinsUltimaSemana > checkinsSemanaAnterior) tendencia = 'up';
    else if (checkinsUltimaSemana < checkinsSemanaAnterior) tendencia = 'down';

    // Frequência de Check-ins
    const ultimos7Dias = checkinsUltimaSemana;
    const ultimos30Dias = checkins.filter(c => new Date(c.created_at) >= umMesAtras).length;
    
    const porPlanta = plantas.map(planta => {
      const checkinsPlanta = checkins.filter(c => c.planta_id === planta.id);
      return {
        id: planta.id,
        strain: planta.strain,
        totalCheckins: checkinsPlanta.length,
        ultimoCheckin: checkinsPlanta.length > 0 ? checkinsPlanta[0].created_at : null,
        diasSemCheckin: checkinsPlanta.length > 0 
          ? Math.floor((agora - new Date(checkinsPlanta[0].created_at)) / (1000 * 60 * 60 * 24))
          : null
      };
    });

    // Tarefas Populares
    const todasTarefas = checkins.flatMap(c => {
      try {
        return Array.isArray(c.tarefas_concluidas) 
          ? c.tarefas_concluidas 
          : JSON.parse(c.tarefas_concluidas || '[]');
      } catch {
        return [];
      }
    });

    const contadorTarefas = {};
    todasTarefas.forEach(tarefa => {
      contadorTarefas[tarefa] = (contadorTarefas[tarefa] || 0) + 1;
    });

    const tarefasPopulares = Object.entries(contadorTarefas)
      .map(([tarefa, count]) => ({ tarefa, count, percentual: (count / todasTarefas.length * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Análise Tempo Real
    const plantasComAtraso = porPlanta.filter(p => p.diasSemCheckin > 7);
    const plantasEmDia = porPlanta.filter(p => p.diasSemCheckin <= 7);

    // Recomendações baseadas nos dados
    const recomendacoes = gerarRecomendacoes(plantas, checkins, plantasComAtraso);

    // Crescimento por Fase
    const crescimentoPorFase = {
      germinacao: {
        plantas: plantas.filter(p => p.fase_atual === 'germinacao').length,
        mediaCheckins: calcularMediaCheckinsPorFase(plantas, checkins, 'germinacao')
      },
      vegetativa: {
        plantas: plantas.filter(p => p.fase_atual === 'vegetativa').length,
        mediaCheckins: calcularMediaCheckinsPorFase(plantas, checkins, 'vegetativa')
      },
      floracao: {
        plantas: plantas.filter(p => p.fase_atual === 'floracao').length,
        mediaCheckins: calcularMediaCheckinsPorFase(plantas, checkins, 'floracao')
      }
    };

    // Insights automáticos
    const insights = gerarInsights(plantas, checkins, tarefasPopulares, plantasComAtraso);

    return {
      resumoGeral: {
        totalCheckins,
        plantasAtivas,
        mediaCheckinsSemanais,
        ultimoCheckin,
        tendencia
      },
      frequenciaCheckins: {
        ultimos7Dias,
        ultimos30Dias,
        porPlanta
      },
      tarefasPopulares,
      analiseTempoReal: {
        plantasComAtraso,
        plantasEmDia,
        recomendacoes
      },
      crescimentoPorFase,
      insights
    };
  };

  // Calcular média de check-ins por fase
  const calcularMediaCheckinsPorFase = (plantas, checkins, fase) => {
    const plantasFase = plantas.filter(p => p.fase_atual === fase);
    if (plantasFase.length === 0) return 0;

    const totalCheckins = plantasFase.reduce((total, planta) => {
      return total + checkins.filter(c => c.planta_id === planta.id).length;
    }, 0);

    return Math.round(totalCheckins / plantasFase.length);
  };

  // Gerar recomendações baseadas nos dados
  const gerarRecomendacoes = (plantas, checkins, plantasComAtraso) => {
    const recomendacoes = [];

    if (plantasComAtraso.length > 0) {
      recomendacoes.push({
        tipo: 'urgente',
        titulo: 'Check-ins em Atraso',
        descricao: `${plantasComAtraso.length} planta${plantasComAtraso.length > 1 ? 's' : ''} sem check-in há mais de 7 dias`,
        acao: 'Realizar check-in imediatamente'
      });
    }

    if (checkins.length < plantas.length * 2) {
      recomendacoes.push({
        tipo: 'melhoria',
        titulo: 'Frequência de Check-ins',
        descricao: 'Aumente a frequência de check-ins para melhor acompanhamento',
        acao: 'Fazer check-in pelo menos 2x por semana'
      });
    }

    const plantasVegetativa = plantas.filter(p => p.fase_atual === 'vegetativa');
    if (plantasVegetativa.length > 0) {
      recomendacoes.push({
        tipo: 'dica',
        titulo: 'Fase Vegetativa',
        descricao: 'Plantas em fase vegetativa precisam de atenção especial',
        acao: 'Foque em rega, poda e controle de luz'
      });
    }

    return recomendacoes;
  };

  // Gerar insights automáticos
  const gerarInsights = (plantas, checkins, tarefasPopulares, plantasComAtraso) => {
    const insights = [];

    if (tarefasPopulares.length > 0) {
      insights.push({
        titulo: 'Tarefa Mais Realizada',
        valor: tarefasPopulares[0].tarefa,
        descricao: `${tarefasPopulares[0].percentual}% dos check-ins`,
        tipo: 'info'
      });
    }

    if (plantasComAtraso.length === 0) {
      insights.push({
        titulo: 'Parabéns!',
        valor: 'Todas as plantas em dia',
        descricao: 'Nenhuma planta com atraso no check-in',
        tipo: 'sucesso'
      });
    }

    const mediaIdade = plantas.reduce((sum, p) => sum + (p.idade_dias || 0), 0) / plantas.length;
    if (mediaIdade > 0) {
      insights.push({
        titulo: 'Idade Média das Plantas',
        valor: `${Math.round(mediaIdade)} dias`,
        descricao: 'Tempo médio de cultivo',
        tipo: 'info'
      });
    }

    return insights;
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Detalhados</h1>
          <p className="text-gray-600">Análise completa dos seus check-ins e cultivo</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filtros.periodo}
            onChange={(e) => setFiltros(prev => ({ ...prev, periodo: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button
            onClick={carregarDados}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Resumo Geral */}
      <BentoGrid>
        <BentoCard span={1}>
          <BentoStat 
            label="Total de Check-ins" 
            value={relatorios.resumoGeral.totalCheckins}
            icon={CheckCircle}
            trend={relatorios.resumoGeral.tendencia === 'up' ? 'up' : relatorios.resumoGeral.tendencia === 'down' ? 'down' : null}
          />
        </BentoCard>
        
        <BentoCard span={1}>
          <BentoStat 
            label="Plantas Ativas" 
            value={relatorios.resumoGeral.plantasAtivas}
            icon={Sprout}
          />
        </BentoCard>
        
        <BentoCard span={1}>
          <BentoStat 
            label="Check-ins/Semana" 
            value={relatorios.resumoGeral.mediaCheckinsSemanais}
            icon={Calendar}
            trend={relatorios.resumoGeral.tendencia === 'up' ? 'up' : relatorios.resumoGeral.tendencia === 'down' ? 'down' : null}
          />
        </BentoCard>
        
        <BentoCard span={1}>
          <BentoStat 
            label="Último Check-in" 
            value={relatorios.resumoGeral.ultimoCheckin 
              ? `${Math.floor((new Date() - new Date(relatorios.resumoGeral.ultimoCheckin)) / (1000 * 60 * 60 * 24))} dias atrás`
              : 'Nenhum'
            }
            icon={Clock}
          />
        </BentoCard>
      </BentoGrid>

      {/* Tarefas Populares */}
      <BentoCard>
        <BentoHeader
          title="Tarefas Mais Realizadas"
          subtitle="Atividades mais frequentes nos check-ins"
          icon={BarChart3}
        />
        <BentoContent>
          {relatorios.tarefasPopulares.length > 0 ? (
            <div className="space-y-3">
              {relatorios.tarefasPopulares.map((tarefa, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tarefa.tarefa}</p>
                      <p className="text-sm text-gray-600">{tarefa.count} vezes realizadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{tarefa.percentual}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum check-in registrado ainda</p>
          )}
        </BentoContent>
      </BentoCard>

      {/* Análise por Planta */}
      <BentoCard>
        <BentoHeader
          title="Status por Planta"
          subtitle="Frequência de check-ins de cada planta"
          icon={Target}
        />
        <BentoContent>
          {relatorios.frequenciaCheckins.porPlanta.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {relatorios.frequenciaCheckins.porPlanta.map((planta) => (
                <div key={planta.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{planta.strain}</p>
                    <p className="text-sm text-gray-600">
                      {planta.totalCheckins} check-in{planta.totalCheckins !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    {planta.diasSemCheckin !== null ? (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        planta.diasSemCheckin <= 3 ? 'bg-green-100 text-green-700' :
                        planta.diasSemCheckin <= 7 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {planta.diasSemCheckin === 0 ? 'Hoje' :
                         planta.diasSemCheckin === 1 ? 'Ontem' :
                         `${planta.diasSemCheckin} dias atrás`}
                      </div>
                    ) : (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Sem check-in
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma planta cadastrada</p>
          )}
        </BentoContent>
      </BentoCard>

      {/* Recomendações */}
      {relatorios.analiseTempoReal.recomendacoes.length > 0 && (
        <BentoCard>
          <BentoHeader
            title="Recomendações"
            subtitle="Sugestões baseadas nos seus dados"
            icon={AlertTriangle}
          />
          <BentoContent>
            <div className="space-y-3">
              {relatorios.analiseTempoReal.recomendacoes.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.tipo === 'urgente' ? 'bg-red-50 border-red-400' :
                  rec.tipo === 'melhoria' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <h4 className="font-medium mb-1">{rec.titulo}</h4>
                  <p className="text-sm text-gray-600 mb-2">{rec.descricao}</p>
                  <p className="text-sm font-medium text-green-600">{rec.acao}</p>
                </div>
              ))}
            </div>
          </BentoContent>
        </BentoCard>
      )}

      {/* Insights */}
      {relatorios.insights.length > 0 && (
        <BentoGrid>
          {relatorios.insights.map((insight, index) => (
            <BentoCard key={index} span={1}>
              <div className="text-center p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">{insight.titulo}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{insight.valor}</p>
                <p className="text-xs text-gray-500">{insight.descricao}</p>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </div>
  );
};

export default RelatoriosDetalhados;

