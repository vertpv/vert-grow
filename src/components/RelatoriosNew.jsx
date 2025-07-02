import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const RelatoriosNew = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saude');
  const [dados, setDados] = useState({
    plantas: [],
    tendas: [],
    registrosAmbientais: [],
    estatisticas: {}
  });

  const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('supabase_token');
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar plantas
      const plantasResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}&select=*,tendas(nome)`, {
        headers: getAuthHeaders()
      });
      const plantas = plantasResponse.ok ? await plantasResponse.json() : [];

      // Carregar tendas
      const tendasResponse = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      const tendas = tendasResponse.ok ? await tendasResponse.json() : [];

      // Carregar registros ambientais
      const registrosResponse = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais?user_id=eq.${user.id}&order=data_registro.desc&limit=30`, {
        headers: getAuthHeaders()
      });
      const registrosAmbientais = registrosResponse.ok ? await registrosResponse.json() : [];

      // Calcular estatísticas
      const estatisticas = calcularEstatisticas(plantas, tendas, registrosAmbientais);

      setDados({
        plantas,
        tendas,
        registrosAmbientais,
        estatisticas
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (plantas, tendas, registros) => {
    const hoje = new Date();
    
    // Estatísticas de plantas
    const plantasPorFase = plantas.reduce((acc, planta) => {
      acc[planta.fase_atual] = (acc[planta.fase_atual] || 0) + 1;
      return acc;
    }, {});

    // Plantas com problemas (mais de 7 dias sem check-in)
    const plantasComProblemas = plantas.filter(planta => {
      const ultimoCheckin = planta.ultimo_checkin ? new Date(planta.ultimo_checkin) : null;
      if (!ultimoCheckin) return true;
      const diasSemCheckin = Math.floor((hoje - ultimoCheckin) / (1000 * 60 * 60 * 24));
      return diasSemCheckin > 7;
    });

    // Plantas saudáveis
    const plantasSaudaveis = plantas.filter(planta => {
      const ultimoCheckin = planta.ultimo_checkin ? new Date(planta.ultimo_checkin) : null;
      if (!ultimoCheckin) return false;
      const diasSemCheckin = Math.floor((hoje - ultimoCheckin) / (1000 * 60 * 60 * 24));
      return diasSemCheckin <= 3;
    });

    // Estatísticas ambientais
    const temperaturaMedia = registros.length > 0 
      ? registros.reduce((sum, r) => sum + (r.temperatura || 0), 0) / registros.length 
      : 0;
    
    const umidadeMedia = registros.length > 0 
      ? registros.reduce((sum, r) => sum + (r.umidade || 0), 0) / registros.length 
      : 0;

    return {
      totalPlantas: plantas.length,
      totalTendas: tendas.length,
      totalRegistros: registros.length,
      plantasPorFase,
      plantasComProblemas: plantasComProblemas.length,
      plantasSaudaveis: plantasSaudaveis.length,
      temperaturaMedia: Math.round(temperaturaMedia * 10) / 10,
      umidadeMedia: Math.round(umidadeMedia * 10) / 10,
      plantasDetalhadas: plantas.map(planta => {
        const ultimoCheckin = planta.ultimo_checkin ? new Date(planta.ultimo_checkin) : null;
        const diasSemCheckin = ultimoCheckin 
          ? Math.floor((hoje - ultimoCheckin) / (1000 * 60 * 60 * 24))
          : 999;
        
        let status = 'problema';
        if (diasSemCheckin <= 3) status = 'saudavel';
        else if (diasSemCheckin <= 7) status = 'atencao';

        return {
          ...planta,
          diasSemCheckin,
          status
        };
      })
    };
  };

  const exportarCSV = (dados, nomeArquivo) => {
    if (!dados || dados.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    const headers = Object.keys(dados[0]);
    const csvContent = [
      headers.join(','),
      ...dados.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: 'saude', label: 'Saúde das Plantas', icon: Activity },
    { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
    { id: 'ambiente', label: 'Ambiente', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-bold mb-2">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Visualize a saúde e performance do seu cultivo</p>
        </div>
        <button
          className="btn btn-outline gap-2"
          onClick={() => exportarCSV(dados.plantas, `plantas-completo-${new Date().toISOString().split('T')[0]}`)}
        >
          <Download size={16} />
          Exportar Dados
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-secondary' : 'btn-ghost'} gap-2`}
              onClick={() => setActiveTab(tab.id)}
              style={{ borderRadius: '8px 8px 0 0' }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'saude' && <SaudePlantas dados={dados} />}
      {activeTab === 'estatisticas' && <Estatisticas dados={dados} exportarCSV={exportarCSV} />}
      {activeTab === 'ambiente' && <RelatorioAmbiente dados={dados} exportarCSV={exportarCSV} />}
    </div>
  );
};

// Componente de Saúde das Plantas
const SaudePlantas = ({ dados }) => {
  const { estatisticas } = dados;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'saudavel': return '#22c55e';
      case 'atencao': return '#f59e0b';
      case 'problema': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'saudavel': return <CheckCircle size={16} color="#22c55e" />;
      case 'atencao': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'problema': return <AlertTriangle size={16} color="#ef4444" />;
      default: return <Activity size={16} color="#64748b" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'saudavel': return 'Saudável';
      case 'atencao': return 'Atenção';
      case 'problema': return 'Problema';
      default: return 'Desconhecido';
    }
  };

  return (
    <div>
      {/* Cards de Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} color="#22c55e" />
              <span className="font-medium">Plantas Saudáveis</span>
            </div>
            <div className="text-lg font-bold">{estatisticas.plantasSaudaveis}</div>
            <div className="text-sm text-muted-foreground">
              {estatisticas.totalPlantas > 0 
                ? Math.round((estatisticas.plantasSaudaveis / estatisticas.totalPlantas) * 100)
                : 0}% do total
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={20} color="#f59e0b" />
              <span className="font-medium">Precisam Atenção</span>
            </div>
            <div className="text-lg font-bold">
              {estatisticas.totalPlantas - estatisticas.plantasSaudaveis - estatisticas.plantasComProblemas}
            </div>
            <div className="text-sm text-muted-foreground">4-7 dias sem check-in</div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={20} color="#ef4444" />
              <span className="font-medium">Com Problemas</span>
            </div>
            <div className="text-lg font-bold">{estatisticas.plantasComProblemas}</div>
            <div className="text-sm text-muted-foreground">+7 dias sem check-in</div>
          </div>
        </div>
      </div>

      {/* Lista Detalhada de Plantas */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Status Detalhado das Plantas</h3>
        </div>
        <div className="card-content">
          {estatisticas.plantasDetalhadas.length === 0 ? (
            <div className="text-center text-muted-foreground p-6">
              Nenhuma planta encontrada
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {estatisticas.plantasDetalhadas.map(planta => (
                <div 
                  key={planta.id} 
                  className="flex items-center justify-between p-3"
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius)',
                    borderLeft: `4px solid ${getStatusColor(planta.status)}`
                  }}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(planta.status)}
                    <div>
                      <div className="font-medium">{planta.strain}</div>
                      <div className="text-sm text-muted-foreground">
                        {planta.fase_atual} • {planta.tendas?.nome || 'Sem tenda'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{getStatusText(planta.status)}</div>
                    <div className="text-sm text-muted-foreground">
                      {planta.diasSemCheckin === 999 
                        ? 'Nunca' 
                        : `${planta.diasSemCheckin} dias atrás`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Estatísticas
const Estatisticas = ({ dados, exportarCSV }) => {
  const { estatisticas } = dados;

  return (
    <div>
      {/* Cards de Estatísticas Gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted-foreground">Total de Plantas</div>
            <div className="text-lg font-bold">{estatisticas.totalPlantas}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted-foreground">Total de Tendas</div>
            <div className="text-lg font-bold">{estatisticas.totalTendas}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted-foreground">Registros Ambientais</div>
            <div className="text-lg font-bold">{estatisticas.totalRegistros}</div>
          </div>
        </div>
      </div>

      {/* Distribuição por Fase */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="font-semibold">Distribuição por Fase</h3>
        </div>
        <div className="card-content">
          {Object.keys(estatisticas.plantasPorFase).length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhuma planta cadastrada</div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(estatisticas.plantasPorFase).map(([fase, quantidade]) => (
                <div key={fase} className="flex items-center justify-between">
                  <span className="font-medium capitalize">{fase}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      style={{ 
                        width: '100px', 
                        height: '8px', 
                        backgroundColor: 'var(--secondary)', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{ 
                          width: `${(quantidade / estatisticas.totalPlantas) * 100}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botões de Exportação */}
      <div className="flex gap-2">
        <button
          className="btn btn-outline gap-2"
          onClick={() => exportarCSV(dados.plantas, `plantas-${new Date().toISOString().split('T')[0]}`)}
        >
          <Download size={16} />
          Exportar Plantas
        </button>
        <button
          className="btn btn-outline gap-2"
          onClick={() => exportarCSV(dados.tendas, `tendas-${new Date().toISOString().split('T')[0]}`)}
        >
          <Download size={16} />
          Exportar Tendas
        </button>
      </div>
    </div>
  );
};

// Componente de Relatório Ambiental
const RelatorioAmbiente = ({ dados, exportarCSV }) => {
  const { registrosAmbientais, estatisticas } = dados;

  return (
    <div>
      {/* Cards de Médias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted-foreground">Temperatura Média</div>
            <div className="text-lg font-bold">{estatisticas.temperaturaMedia}°C</div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-sm text-muted-foreground">Umidade Média</div>
            <div className="text-lg font-bold">{estatisticas.umidadeMedia}%</div>
          </div>
        </div>
      </div>

      {/* Tabela de Registros */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Últimos Registros Ambientais</h3>
            <button
              className="btn btn-outline gap-2"
              onClick={() => exportarCSV(registrosAmbientais, `ambiente-${new Date().toISOString().split('T')[0]}`)}
            >
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>
        <div className="card-content">
          {registrosAmbientais.length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhum registro ambiental encontrado</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Data</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Temperatura</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Umidade</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosAmbientais.slice(0, 10).map((registro, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px' }}>
                        {new Date(registro.data_registro).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ padding: '12px' }}>{registro.temperatura}°C</td>
                      <td style={{ padding: '12px' }}>{registro.umidade}%</td>
                      <td style={{ padding: '12px' }}>{registro.observacoes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosNew;

