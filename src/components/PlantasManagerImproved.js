import React, { useState, useEffect } from 'react';
import CheckinLote from './CheckinLote';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const PlantasManagerImproved = ({ user }) => {
  const [plantas, setPlantas] = useState([]);
  const [tendas, setTendas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckinLote, setShowCheckinLote] = useState(false);
  const [selectedPlanta, setSelectedPlanta] = useState(null);
  const [editingPlanta, setEditingPlanta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [novaPlanta, setNovaPlanta] = useState({
    strain: '',
    origem: '',
    data_plantio: '',
    data_germinacao: '',
    vaso_litragem: 10,
    fase_atual: 'germinacao',
    tenda_id: ''
  });

  const [checkinData, setCheckinData] = useState({
    data: new Date().toISOString().split('T')[0],
    tarefas_concluidas: [],
    observacoes: ''
  });

  const tarefasDisponiveis = [
    'Rega',
    'Verificação de pragas',
    'Poda',
    'LST (Low Stress Training)',
    'Defoliação',
    'Medição pH',
    'Fertilização',
    'Verificação de tricomas',
    'Ajuste de luz',
    'Controle de umidade'
  ];

  useEffect(() => {
    console.log('PlantasManagerImproved: useEffect acionado. User:', user);
    if (user?.id) {
      loadPlantas();
      loadTendas();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('vert-grow-token');
    console.log('PlantasManagerImproved: Token encontrado:', token ? 'Sim' : 'Não', 'Token:', token);
    
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`
    };
  };

  const loadPlantas = async () => {
    try {
      if (!user?.id) {
        console.log('PlantasManagerImproved: Usuário não autenticado, não carregando plantas.');
        return;
      }
      console.log('PlantasManagerImproved: Carregando plantas para user.id:', user.id);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}&select=*,tendas(nome)`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        // Calcular idade em dias e adicionar nome da tenda
        const plantasComIdade = data.map(planta => ({
          ...planta,
          idade_dias: planta.data_plantio ? 
            Math.floor((new Date() - new Date(planta.data_plantio)) / (1000 * 60 * 60 * 24)) : 0,
          tenda_nome: planta.tendas?.nome || null
        }));
        setPlantas(plantasComIdade);
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao carregar plantas:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao carregar plantas:', error);
    }
  };

  const loadTendas = async () => {
    try {
      if (!user?.id) {
        console.log('PlantasManagerImproved: Usuário não autenticado, não carregando tendas.');
        return;
      }
      console.log('PlantasManagerImproved: Carregando tendas para user.id:', user.id);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        // Calcular plantas disponíveis para cada tenda
        const tendasComCapacidade = await Promise.all(data.map(async (tenda) => {
          const plantasResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas?tenda_id=eq.${tenda.id}&select=id`, {
            headers: getAuthHeaders()
          });
          const plantasNaTenda = plantasResponse.ok ? await plantasResponse.json() : [];
          
          return {
            ...tenda,
            plantas_atuais: plantasNaTenda.length,
            plantas_disponiveis: tenda.limite_plantas - plantasNaTenda.length,
            ppfd_calculado: calcularPPFD(tenda)
          };
        }));
        setTendas(tendasComCapacidade);
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao carregar tendas:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao carregar tendas:', error);
    }
  };

  const calcularPPFD = (tenda) => {
    const [largura, comprimento] = tenda.dimensoes.split('x').map(d => parseInt(d));
    const area = (largura * comprimento) / 10000; // cm² para m²
    const ppfd = (tenda.watts * tenda.quantidade_paineis * 2.5) / area;
    return Math.round(ppfd);
  };

  const handleAddPlanta = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        console.error('PlantasManagerImproved: Usuário não autenticado');
        return;
      }

      const plantaData = {
        ...novaPlanta,
        user_id: user.id,
        tenda_id: novaPlanta.tenda_id || null,
        created_at: new Date().toISOString()
      };

      console.log('PlantasManagerImproved: Dados da planta a serem enviados:', plantaData);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(plantaData),
      });

      if (response.ok) {
        await loadPlantas();
        await loadTendas();
        setShowAddModal(false);
        setCurrentStep(1);
        resetForm();
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao adicionar planta:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao adicionar planta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlanta = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?id=eq.${editingPlanta.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...novaPlanta,
          tenda_id: novaPlanta.tenda_id || null
        }),
      });

      if (response.ok) {
        await loadPlantas();
        await loadTendas();
        setShowEditModal(false);
        setEditingPlanta(null);
        setCurrentStep(1);
        resetForm();
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao editar planta:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao editar planta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlanta = async (plantaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta planta?')) return;

    try {
      // Primeiro, remover todos os check-ins da planta
      await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta?planta_id=eq.${plantaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      // Depois, remover a planta
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?id=eq.${plantaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        await loadPlantas();
        await loadTendas();
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao remover planta:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao remover planta:', error);
    }
  };

  const openEditModal = (planta) => {
    setEditingPlanta(planta);
    setNovaPlanta({
      strain: planta.strain,
      origem: planta.origem || '',
      data_plantio: planta.data_plantio || '',
      data_germinacao: planta.data_germinacao || '',
      vaso_litragem: planta.vaso_litragem,
      fase_atual: planta.fase_atual,
      tenda_id: planta.tenda_id || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setNovaPlanta({
      strain: '',
      origem: '',
      data_plantio: '',
      data_germinacao: '',
      vaso_litragem: 10,
      fase_atual: 'germinacao',
      tenda_id: ''
    });
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        console.error('PlantasManagerImproved: Usuário não autenticado');
        return;
      }

      const checkinDataWithUser = {
        ...checkinData,
        planta_id: selectedPlanta.id,
        user_id: user.id,
        tarefas_concluidas: JSON.stringify(checkinData.tarefas_concluidas),
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(checkinDataWithUser),
      });

      if (response.ok) {
        await loadPlantas();
        setShowCheckinModal(false);
        setSelectedPlanta(null);
        setCheckinData({
          data: new Date().toISOString().split('T')[0],
          tarefas_concluidas: [],
          observacoes: ''
        });
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao fazer check-in:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao fazer check-in:', error);
    } finally {
      setLoading(false);
    }
  };

  const moverPlanta = async (plantaId, novaTendaId) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?id=eq.${plantaId}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          tenda_id: novaTendaId || null 
        }),
      });

      if (response.ok) {
        await loadPlantas();
        await loadTendas();
      } else {
        const error = await response.text();
        console.error('PlantasManagerImproved: Erro ao mover planta:', response.status, error);
      }
    } catch (error) {
      console.error('PlantasManagerImproved: Erro ao mover planta:', error);
    }
  };

  const getFaseBadge = (fase) => {
    const badges = {
      germinacao: { color: '#4CAF50', text: '🌱 Germinação' },
      vegetativa: { color: '#2196F3', text: '🌿 Vegetativa' },
      floracao: { color: '#FF9800', text: '🌸 Floração' }
    };
    return badges[fase] || badges.germinacao;
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>📝 Informações Básicas</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Strain *</label>
                <input
                  type="text"
                  value={novaPlanta.strain}
                  onChange={(e) => setNovaPlanta({...novaPlanta, strain: e.target.value})}
                  placeholder="Ex: White Widow, OG Kush"
                  required
                />
              </div>

              <div className="form-group">
                <label>Origem</label>
                <select
                  value={novaPlanta.origem}
                  onChange={(e) => setNovaPlanta({...novaPlanta, origem: e.target.value})}
                >
                  <option value="">Selecione a origem</option>
                  <option value="Semente">🌰 Semente</option>
                  <option value="Clone">🌿 Clone</option>
                  <option value="Mudas">🌱 Mudas</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fase Atual</label>
                <select
                  value={novaPlanta.fase_atual}
                  onChange={(e) => setNovaPlanta({...novaPlanta, fase_atual: e.target.value})}
                >
                  <option value="germinacao">🌱 Germinação</option>
                  <option value="vegetativa">🌿 Vegetativa</option>
                  <option value="floracao">🌸 Floração</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>📅 Datas e Cronograma</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Data de Plantio</label>
                <input
                  type="date"
                  value={novaPlanta.data_plantio}
                  onChange={(e) => setNovaPlanta({...novaPlanta, data_plantio: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Data de Germinação</label>
                <input
                  type="date"
                  value={novaPlanta.data_germinacao}
                  onChange={(e) => setNovaPlanta({...novaPlanta, data_germinacao: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Litragem do Vaso</label>
                <select
                  value={novaPlanta.vaso_litragem}
                  onChange={(e) => setNovaPlanta({...novaPlanta, vaso_litragem: parseInt(e.target.value)})}
                >
                  <option value={3}>3L - Pequeno</option>
                  <option value={5}>5L - Médio</option>
                  <option value={7}>7L - Médio/Grande</option>
                  <option value={10}>10L - Grande</option>
                  <option value={15}>15L - Extra Grande</option>
                  <option value={20}>20L - Máximo</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>🏠 Localização</h3>
            <div className="form-group">
              <label>Tenda de Cultivo</label>
              <select
                value={novaPlanta.tenda_id}
                onChange={(e) => setNovaPlanta({...novaPlanta, tenda_id: e.target.value})}
              >
                <option value="">🌿 Sem tenda (cultivo livre)</option>
                {tendas.map(tenda => (
                  <option key={tenda.id} value={tenda.id}>
                    🏠 {tenda.nome} ({tenda.plantas_atuais}/{tenda.limite_plantas} plantas)
                  </option>
                ))}
              </select>
              
              {novaPlanta.tenda_id && (
                <div className="tenda-info">
                  {(() => {
                    const tenda = tendas.find(t => t.id === parseInt(novaPlanta.tenda_id));
                    return tenda ? (
                      <div className="info-card">
                        <p><strong>Dimensões:</strong> {tenda.dimensoes}</p>
                        <p><strong>PPFD:</strong> {tenda.ppfd_calculado} μmol/m²/s</p>
                        <p><strong>Plantas atuais:</strong> {tenda.plantas_atuais}/{tenda.limite_plantas}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="plantas-manager-improved">
      <div className="section-header">
        <h2>🌱 Gerenciamento de Plantas</h2>
        <div className="header-buttons">
          <button 
            className="batch-checkin-button"
            onClick={() => setShowCheckinLote(true)}
            disabled={plantas.length === 0}
          >
            <span className="button-icon">✅</span>
            <span className="button-text">Check-in em Lote</span>
          </button>
          <button 
            className="add-button-improved"
            onClick={() => setShowAddModal(true)}
          >
            <span className="button-icon">➕</span>
            <span className="button-text">Nova Planta</span>
          </button>
        </div>
      </div>

      <div className="plantas-grid">
        {plantas.map(planta => {
          const badge = getFaseBadge(planta.fase_atual);
          return (
            <div key={planta.id} className="planta-card-improved">
              <div className="planta-header">
                <h3>{planta.strain}</h3>
                <span 
                  className="fase-badge"
                  style={{ backgroundColor: badge.color }}
                >
                  {badge.text}
                </span>
              </div>

              <div className="planta-info">
                <div className="info-row">
                  <span>🏠 Tenda:</span>
                  <span>{planta.tenda_nome || 'Cultivo livre'}</span>
                </div>
                <div className="info-row">
                  <span>📅 Idade:</span>
                  <span>{planta.idade_dias} dias</span>
                </div>
                <div className="info-row">
                  <span>🪴 Vaso:</span>
                  <span>{planta.vaso_litragem}L</span>
                </div>
                {planta.origem && (
                  <div className="info-row">
                    <span>🌰 Origem:</span>
                    <span>{planta.origem}</span>
                  </div>
                )}
              </div>

              <div className="planta-actions">
                <button 
                  className="action-button checkin-button"
                  onClick={() => {
                    setSelectedPlanta(planta);
                    setShowCheckinModal(true);
                  }}
                >
                  ✅ Check-in
                </button>
                <button 
                  className="action-button edit-button"
                  onClick={() => openEditModal(planta)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="action-button delete-button"
                  onClick={() => handleDeletePlanta(planta.id)}
                >
                  🗑️ Remover
                </button>
              </div>

              {/* Mover planta entre tendas */}
              <div className="move-section">
                <label>Mover para:</label>
                <select
                  value={planta.tenda_id || ''}
                  onChange={(e) => moverPlanta(planta.id, e.target.value)}
                >
                  <option value="">🌿 Cultivo livre</option>
                  {tendas.filter(t => t.plantas_disponiveis > 0 || t.id === planta.tenda_id).map(tenda => (
                    <option key={tenda.id} value={tenda.id}>
                      🏠 {tenda.nome} ({tenda.plantas_atuais}/{tenda.limite_plantas} plantas)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}

        {plantas.length === 0 && (
          <div className="empty-state">
            <p>🌱 Nenhuma planta cadastrada</p>
            <p>Adicione sua primeira planta para começar!</p>
          </div>
        )}
      </div>

      {/* Modal Adicionar/Editar Planta */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-wizard">
            <div className="modal-header">
              <h3>{showEditModal ? 'Editar Planta' : 'Nova Planta'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingPlanta(null);
                  setCurrentStep(1);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <div className="wizard-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
              <div className="step-indicators">
                {[1, 2, 3].map(step => (
                  <div 
                    key={step}
                    className={`step-indicator ${currentStep >= step ? 'active' : ''}`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={showEditModal ? handleEditPlanta : handleAddPlanta} className="wizard-form">
              {renderStepContent()}

              <div className="wizard-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  ← Anterior
                </button>
                
                {currentStep < 3 ? (
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={nextStep}
                    disabled={currentStep === 1 && !novaPlanta.strain}
                  >
                    Próximo →
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : (showEditModal ? 'Salvar Alterações' : 'Adicionar Planta')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Check-in Individual */}
      {showCheckinModal && selectedPlanta && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Check-in: {selectedPlanta.strain}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowCheckinModal(false);
                  setSelectedPlanta(null);
                  setCheckinData({
                    data: new Date().toISOString().split('T')[0],
                    tarefas_concluidas: [],
                    observacoes: ''
                  });
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCheckin} className="modal-form">
              <div className="form-group">
                <label>Data:</label>
                <input
                  type="date"
                  value={checkinData.data}
                  onChange={(e) => setCheckinData({...checkinData, data: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tarefas Realizadas:</label>
                <div className="tarefas-grid">
                  {tarefasDisponiveis.map(tarefa => (
                    <label key={tarefa} className="tarefa-checkbox">
                      <input
                        type="checkbox"
                        checked={checkinData.tarefas_concluidas.includes(tarefa)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckinData({
                              ...checkinData,
                              tarefas_concluidas: [...checkinData.tarefas_concluidas, tarefa]
                            });
                          } else {
                            setCheckinData({
                              ...checkinData,
                              tarefas_concluidas: checkinData.tarefas_concluidas.filter(t => t !== tarefa)
                            });
                          }
                        }}
                      />
                      {tarefa}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Observações:</label>
                <textarea
                  value={checkinData.observacoes}
                  onChange={(e) => setCheckinData({...checkinData, observacoes: e.target.value})}
                  placeholder="Observações sobre o desenvolvimento da planta..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowCheckinModal(false);
                    setSelectedPlanta(null);
                    setCheckinData({
                      data: new Date().toISOString().split('T')[0],
                      tarefas_concluidas: [],
                      observacoes: ''
                    });
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Check-in em Lote */}
      {showCheckinLote && (
        <CheckinLote
          plantas={plantas}
          user={user}
          onClose={() => setShowCheckinLote(false)}
          onSuccess={() => {
            setShowCheckinLote(false);
            loadPlantas();
          }}
        />
      )}
    </div>
  );
};

export default PlantasManagerImproved;

