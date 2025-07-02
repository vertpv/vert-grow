import React, { useState, useEffect } from 'react';

const Relatorios = ({ user }) => {
  const [relatorioData, setRelatorioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumo');

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/api/cultivo/relatorios', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRelatorioData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
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
          // Escapar vírgulas e aspas
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

  const exportarJSON = (dados, nomeArquivo) => {
    const jsonContent = JSON.stringify(dados, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${nomeArquivo}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  if (!relatorioData) {
    return (
      <div className="error-state">
        <h3>Erro ao carregar relatórios</h3>
        <p>Tente novamente mais tarde.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'resumo', label: '📊 Resumo Geral', icon: '📊' },
    { id: 'plantas', label: '🌱 Plantas', icon: '🌱' },
    { id: 'tendas', label: '🏠 Tendas', icon: '🏠' },
    { id: 'ambiente', label: '🌡️ Ambiente', icon: '🌡️' },
    { id: 'checkins', label: '📅 Check-ins', icon: '📅' }
  ];

  return (
    <div className="relatorios">
      <div className="card">
        <div className="card-header">
          <span className="card-icon">📈</span>
          <h2 className="card-title">Relatórios e Exportação</h2>
          <div className="export-buttons">
            <button
              onClick={() => exportarJSON(relatorioData, `cultivo-completo-${new Date().toISOString().split('T')[0]}`)}
              className="export-btn json"
            >
              📄 Exportar JSON
            </button>
          </div>
        </div>

        <nav className="report-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`report-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="report-content">
          {activeTab === 'resumo' && (
            <ResumoGeral data={relatorioData.resumo_geral} strains={relatorioData.strains_stats} />
          )}
          
          {activeTab === 'plantas' && (
            <Relatorioplantas 
              plantas={relatorioData.plantas_detalhadas}
              onExportCSV={exportarCSV}
            />
          )}
          
          {activeTab === 'tendas' && (
            <RelatorioTendas 
              tendas={relatorioData.tendas_detalhadas}
              onExportCSV={exportarCSV}
            />
          )}
          
          {activeTab === 'ambiente' && (
            <RelatorioAmbiente 
              registros={relatorioData.registros_ambientais}
              dados={relatorioData.dados_ambientais}
              onExportCSV={exportarCSV}
            />
          )}
          
          {activeTab === 'checkins' && (
            <RelatorioCheckins 
              checkins={relatorioData.checkins_recentes}
              stats={relatorioData.checkins_stats}
              onExportCSV={exportarCSV}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Componente Resumo Geral
const ResumoGeral = ({ data, strains }) => {
  return (
    <div className="resumo-geral">
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <div className="stat-number">{data.total_plantas}</div>
            <div className="stat-label">Total de Plantas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <div className="stat-number">{data.total_tendas}</div>
            <div className="stat-label">Tendas Ativas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌡️</div>
          <div className="stat-content">
            <div className="stat-number">{data.total_registros_ambientais}</div>
            <div className="stat-label">Registros Ambientais</div>
          </div>
        </div>
      </div>

      <div className="phase-distribution">
        <h3>Distribuição por Fase</h3>
        <div className="phase-chart">
          <div className="phase-item">
            <div className="phase-bar">
              <div 
                className="phase-fill germinacao"
                style={{ width: `${(data.plantas_por_fase.germinacao / data.total_plantas) * 100}%` }}
              ></div>
            </div>
            <div className="phase-info">
              <span className="phase-label">🌰 Germinação</span>
              <span className="phase-count">{data.plantas_por_fase.germinacao}</span>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-bar">
              <div 
                className="phase-fill vegetativa"
                style={{ width: `${(data.plantas_por_fase.vegetativa / data.total_plantas) * 100}%` }}
              ></div>
            </div>
            <div className="phase-info">
              <span className="phase-label">🌱 Vegetativa</span>
              <span className="phase-count">{data.plantas_por_fase.vegetativa}</span>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-bar">
              <div 
                className="phase-fill floracao"
                style={{ width: `${(data.plantas_por_fase.floracao / data.total_plantas) * 100}%` }}
              ></div>
            </div>
            <div className="phase-info">
              <span className="phase-label">🌸 Floração</span>
              <span className="phase-count">{data.plantas_por_fase.floracao}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="strains-stats">
        <h3>Estatísticas por Strain</h3>
        <div className="strains-grid">
          {Object.entries(strains).map(([strain, stats]) => (
            <div key={strain} className="strain-card">
              <h4>{strain}</h4>
              <div className="strain-stats">
                <div className="strain-stat">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="strain-stat">
                  <span className="stat-label">Idade média:</span>
                  <span className="stat-value">{stats.idade_media} dias</span>
                </div>
                <div className="strain-phases">
                  <span className="phase-count germinacao">{stats.germinacao}</span>
                  <span className="phase-count vegetativa">{stats.vegetativa}</span>
                  <span className="phase-count floracao">{stats.floracao}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente Relatório de Plantas
const Relatorioplantas = ({ plantas, onExportCSV }) => {
  const exportarPlantas = () => {
    const dadosExport = plantas.map(planta => ({
      strain: planta.strain,
      origem: planta.origem || '',
      fase_atual: planta.fase_atual,
      data_germinacao: planta.data_germinacao || '',
      data_plantio: planta.data_plantio || '',
      idade_dias: planta.idade_dias,
      vaso_litragem: planta.vaso_litragem,
      tenda: planta.tenda_nome || 'Sem tenda',
      total_checkins: planta.total_checkins
    }));
    
    onExportCSV(dadosExport, `plantas-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="relatorio-plantas">
      <div className="section-header">
        <h3>Relatório de Plantas</h3>
        <button onClick={exportarPlantas} className="export-btn csv">
          📊 Exportar CSV
        </button>
      </div>

      <div className="plantas-table">
        <table>
          <thead>
            <tr>
              <th>Strain</th>
              <th>Fase</th>
              <th>Idade</th>
              <th>Vaso</th>
              <th>Tenda</th>
              <th>Check-ins</th>
            </tr>
          </thead>
          <tbody>
            {plantas.map(planta => (
              <tr key={planta.id}>
                <td>
                  <div className="planta-info">
                    <strong>{planta.strain}</strong>
                    {planta.origem && <small>{planta.origem}</small>}
                  </div>
                </td>
                <td>
                  <span className={`phase-badge phase-${planta.fase_atual}`}>
                    {planta.fase_atual}
                  </span>
                </td>
                <td>{planta.idade_dias} dias</td>
                <td>{planta.vaso_litragem}L</td>
                <td>{planta.tenda_nome || 'Sem tenda'}</td>
                <td>{planta.total_checkins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente Relatório de Tendas
const RelatorioTendas = ({ tendas, onExportCSV }) => {
  const exportarTendas = () => {
    const dadosExport = tendas.map(tenda => ({
      nome: tenda.nome,
      dimensoes: tenda.dimensoes,
      altura: tenda.altura,
      area_m2: tenda.area_m2,
      volume_m3: tenda.volume_m3,
      watts: tenda.watts,
      modelo_led: tenda.modelo_led,
      ppfd_calculado: tenda.ppfd_calculado,
      limite_plantas: tenda.limite_plantas,
      plantas_ocupadas: tenda.plantas_ocupadas,
      plantas_disponiveis: tenda.plantas_disponiveis
    }));
    
    onExportCSV(dadosExport, `tendas-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="relatorio-tendas">
      <div className="section-header">
        <h3>Relatório de Tendas</h3>
        <button onClick={exportarTendas} className="export-btn csv">
          📊 Exportar CSV
        </button>
      </div>

      <div className="tendas-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Dimensões</th>
              <th>Luz</th>
              <th>PPFD</th>
              <th>Ocupação</th>
            </tr>
          </thead>
          <tbody>
            {tendas.map(tenda => (
              <tr key={tenda.id}>
                <td>
                  <div className="tenda-info">
                    <strong>{tenda.nome}</strong>
                    <small>{tenda.area_m2} m² • {tenda.volume_m3} m³</small>
                  </div>
                </td>
                <td>{tenda.dimensoes} cm</td>
                <td>
                  <div className="luz-info">
                    <div>{tenda.watts}W {tenda.modelo_led}</div>
                    <small>{tenda.quantidade_paineis}x painéis</small>
                  </div>
                </td>
                <td>{tenda.ppfd_calculado} μmol/m²/s</td>
                <td>
                  <div className="ocupacao-info">
                    <div>{tenda.plantas_ocupadas}/{tenda.limite_plantas}</div>
                    <div className="ocupacao-bar-small">
                      <div 
                        className="ocupacao-fill-small"
                        style={{ width: `${(tenda.plantas_ocupadas / tenda.limite_plantas) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente Relatório Ambiente
const RelatorioAmbiente = ({ registros, dados, onExportCSV }) => {
  const exportarAmbiente = () => {
    const dadosExport = registros.map(registro => ({
      data_registro: registro.data_registro,
      temperatura: registro.temperatura,
      umidade: registro.umidade,
      observacoes: registro.observacoes || ''
    }));
    
    onExportCSV(dadosExport, `ambiente-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="relatorio-ambiente">
      <div className="section-header">
        <h3>Relatório Ambiental</h3>
        <button onClick={exportarAmbiente} className="export-btn csv">
          📊 Exportar CSV
        </button>
      </div>

      {dados.length > 0 && (
        <div className="ambiente-chart">
          <h4>Últimos 30 Registros</h4>
          <div className="chart-container">
            <SimpleChart dados={dados} />
          </div>
        </div>
      )}

      <div className="ambiente-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Temperatura</th>
              <th>Umidade</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {registros.slice(0, 20).map((registro, index) => (
              <tr key={index}>
                <td>{new Date(registro.data_registro).toLocaleDateString('pt-BR')}</td>
                <td>{registro.temperatura}°C</td>
                <td>{registro.umidade}%</td>
                <td>{registro.observacoes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente Relatório Check-ins
const RelatorioCheckins = ({ checkins, stats, onExportCSV }) => {
  const exportarCheckins = () => {
    const dadosExport = checkins.map(checkin => ({
      data: checkin.data,
      planta_id: checkin.planta_id,
      tarefas_concluidas: JSON.parse(checkin.tarefas_concluidas || '[]').join('; '),
      observacoes: checkin.observacoes || ''
    }));
    
    onExportCSV(dadosExport, `checkins-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="relatorio-checkins">
      <div className="section-header">
        <h3>Relatório de Check-ins</h3>
        <button onClick={exportarCheckins} className="export-btn csv">
          📊 Exportar CSV
        </button>
      </div>

      <div className="checkins-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total_checkins}</div>
          <div className="stat-label">Total de Check-ins</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.plantas_com_checkin}</div>
          <div className="stat-label">Plantas com Check-in</div>
        </div>
      </div>

      <div className="tarefas-mais-comuns">
        <h4>Tarefas Mais Realizadas</h4>
        <div className="tarefas-chart">
          {Object.entries(stats.tarefas_mais_comuns).map(([tarefa, count]) => (
            <div key={tarefa} className="tarefa-item">
              <span className="tarefa-nome">{tarefa.replace('_', ' ')}</span>
              <div className="tarefa-bar">
                <div 
                  className="tarefa-fill"
                  style={{ width: `${(count / Math.max(...Object.values(stats.tarefas_mais_comuns))) * 100}%` }}
                ></div>
              </div>
              <span className="tarefa-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="checkins-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tarefas</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {checkins.slice(0, 20).map((checkin, index) => (
              <tr key={index}>
                <td>{new Date(checkin.data).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div className="tarefas-list">
                    {JSON.parse(checkin.tarefas_concluidas || '[]').map((tarefa, i) => (
                      <span key={i} className="task-badge-small">{tarefa}</span>
                    ))}
                  </div>
                </td>
                <td>{checkin.observacoes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente de gráfico simples
const SimpleChart = ({ dados }) => {
  if (!dados || dados.length === 0) return null;

  const maxTemp = Math.max(...dados.map(d => d.temperatura));
  const minTemp = Math.min(...dados.map(d => d.temperatura));
  const maxUmid = Math.max(...dados.map(d => d.umidade));
  const minUmid = Math.min(...dados.map(d => d.umidade));

  return (
    <div className="simple-chart">
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color temp"></div>
          <span>Temperatura (°C)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color umid"></div>
          <span>Umidade (%)</span>
        </div>
      </div>
      
      <div className="chart-area">
        <svg width="100%" height="200" viewBox="0 0 600 200">
          {/* Linhas de grade */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="50"
              y1={40 + i * 30}
              x2="550"
              y2={40 + i * 30}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}
          
          {/* Linha de temperatura */}
          <polyline
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="2"
            points={dados.map((d, i) => {
              const x = 50 + (i / (dados.length - 1)) * 500;
              const y = 160 - ((d.temperatura - minTemp) / (maxTemp - minTemp)) * 120;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Linha de umidade */}
          <polyline
            fill="none"
            stroke="#4ecdc4"
            strokeWidth="2"
            points={dados.map((d, i) => {
              const x = 50 + (i / (dados.length - 1)) * 500;
              const y = 160 - ((d.umidade - minUmid) / (maxUmid - minUmid)) * 120;
              return `${x},${y}`;
            }).join(' ')}
          />
        </svg>
      </div>
    </div>
  );
};

export default Relatorios;

