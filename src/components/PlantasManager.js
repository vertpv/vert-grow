import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const PlantasManager = ({ user }) => {
  const [plantas, setPlantas] = useState([]);
  const [tendas, setTendas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [editingPlanta, setEditingPlanta] = useState(null);
  const [selectedPlanta, setSelectedPlanta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNoTendaWarning, setShowNoTendaWarning] = useState(false);

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
    if (user?.id) {
      loadPlantas();
      loadTendas();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('supabase_token');
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`
    };
  };

  const loadPlantas = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlantas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar plantas:', error);
    }
  };

  const loadTendas = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setTendas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tendas:', error);
    }
  };

  const handleOpenAddModal = () => {
    if (tendas.length === 0) {
      setShowNoTendaWarning(true);
      return;
    }
    setShowAddModal(true);
  };

  const handleCreateTenda = () => {
    // Disparar evento para mudar para aba de tendas
    const event = new CustomEvent('changeTab', { detail: 'tendas' });
    window.dispatchEvent(event);
    setShowNoTendaWarning(false);
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

  const handleAddPlanta = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        console.error('Usuário não autenticado');
        return;
      }

      const plantaData = {
        ...novaPlanta,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

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
        setShowAddModal(false);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao adicionar planta:', error);
      }
    } catch (error) {
      console.error('Erro ao adicionar planta:', error);
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
        body: JSON.stringify(novaPlanta),
      });

      if (response.ok) {
        await loadPlantas();
        setShowEditModal(false);
        setEditingPlanta(null);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao editar planta:', error);
      }
    } catch (error) {
      console.error('Erro ao editar planta:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (planta) => {
    setEditingPlanta(planta);
    setNovaPlanta({
      strain: planta.strain,
      origem: planta.origem,
      data_plantio: planta.data_plantio,
      data_germinacao: planta.data_germinacao,
      vaso_litragem: planta.vaso_litragem,
      fase_atual: planta.fase_atual,
      tenda_id: planta.tenda_id
    });
    setShowEditModal(true);
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkinDataToSend = {
        planta_id: selectedPlanta.id,
        data: checkinData.data,
        tarefas_concluidas: checkinData.tarefas_concluidas,
        observacoes: checkinData.observacoes,
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(checkinDataToSend),
      });

      if (response.ok) {
        setShowCheckinModal(false);
        setSelectedPlanta(null);
        setCheckinData({
          data: new Date().toISOString().split('T')[0],
          tarefas_concluidas: [],
          observacoes: ''
        });
      } else {
        const error = await response.text();
        console.error('Erro ao fazer check-in:', error);
      }
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlanta = async (plantaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta planta?')) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?id=eq.${plantaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        await loadPlantas();
      }
    } catch (error) {
      console.error('Erro ao remover planta:', error);
    }
  };

  const calcularIdadePlanta = (dataGerminacao) => {
    if (!dataGerminacao) return 0;
    const hoje = new Date();
    const germinacao = new Date(dataGerminacao);
    const diffTime = Math.abs(hoje - germinacao);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getFaseColor = (fase) => {
    switch (fase) {
      case 'germinacao': return '#4CAF50';
      case 'vegetativa': return '#2196F3';
      case 'floracao': return '#FF9800';
      default: return '#757575';
    }
  };

  const getTendaNome = (tendaId) => {
    const tenda = tendas.find(t => t.id === parseInt(tendaId));
    return tenda ? tenda.nome : 'Sem tenda';
  };

  const renderPlantForm = (isEdit = false) => (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? 'Editar Planta' : 'Nova Planta'}</h3>
          <button 
            className="modal-close"
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
                setEditingPlanta(null);
              } else {
                setShowAddModal(false);
              }
              resetForm();
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={isEdit ? handleEditPlanta : handleAddPlanta} className="modal-form">
          <div className="form-group">
            <label>Strain:</label>
            <input
              type="text"
              value={novaPlanta.strain}
              onChange={(e) => setNovaPlanta({...novaPlanta, strain: e.target.value})}
              required
              placeholder="Ex: White Widow"
            />
          </div>

          <div className="form-group">
            <label>Origem:</label>
            <input
              type="text"
              value={novaPlanta.origem}
              onChange={(e) => setNovaPlanta({...novaPlanta, origem: e.target.value})}
              placeholder="Ex: Semente, Clone"
            />
          </div>

          <div className="form-group">
            <label>Data de Plantio:</label>
            <input
              type="date"
              value={novaPlanta.data_plantio}
              onChange={(e) => setNovaPlanta({...novaPlanta, data_plantio: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Data de Germinação:</label>
            <input
              type="date"
              value={novaPlanta.data_germinacao}
              onChange={(e) => setNovaPlanta({...novaPlanta, data_germinacao: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Vaso (Litros):</label>
            <input
              type="number"
              value={novaPlanta.vaso_litragem}
              onChange={(e) => setNovaPlanta({...novaPlanta, vaso_litragem: parseInt(e.target.value)})}
              min="1"
              max="50"
            />
          </div>

          <div className="form-group">
            <label>Fase Atual:</label>
            <select
              value={novaPlanta.fase_atual}
              onChange={(e) => setNovaPlanta({...novaPlanta, fase_atual: e.target.value})}
            >
              <option value="germinacao">Germinação</option>
              <option value="vegetativa">Vegetativa</option>
              <option value="floracao">Floração</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tenda:</label>
            <select
              value={novaPlanta.tenda_id}
              onChange={(e) => setNovaPlanta({...novaPlanta, tenda_id: e.target.value})}
              required
            >
              <option value="">Selecione uma tenda</option>
              {tendas.map(tenda => (
                <option key={tenda.id} value={tenda.id}>
                  {tenda.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setEditingPlanta(null);
                } else {
                  setShowAddModal(false);
                }
                resetForm();
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (isEdit ? 'Salvando...' : 'Adicionando...') : (isEdit ? 'Salvar Alterações' : 'Adicionar Planta')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="plantas-manager">
      <div className="page-header">
        <h2>🌱 Gestão de Plantas</h2>
        <button 
          className="btn-primary"
          onClick={handleOpenAddModal}
        >
          + Nova Planta
        </button>
      </div>

      <div className="plantas-grid">
        {plantas.map(planta => (
          <div key={planta.id} className="planta-card">
            <div className="planta-header">
              <h3>{planta.strain}</h3>
              <div className="planta-actions">
                <button 
                  className="btn-edit"
                  onClick={() => openEditModal(planta)}
                  title="Editar planta"
                >
                  ✏️
                </button>
                <button 
                  className="btn-checkin"
                  onClick={() => {
                    setSelectedPlanta(planta);
                    setShowCheckinModal(true);
                  }}
                  title="Fazer check-in"
                >
                  ✅
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeletePlanta(planta.id)}
                  title="Remover planta"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="planta-info">
              <div className="info-row">
                <span>🏠 Tenda:</span>
                <span>{getTendaNome(planta.tenda_id)}</span>
              </div>
              <div className="info-row">
                <span>📅 Idade:</span>
                <span>{calcularIdadePlanta(planta.data_germinacao)} dias</span>
              </div>
              <div className="info-row">
                <span>🌱 Fase:</span>
                <span 
                  className="fase-badge"
                  style={{ backgroundColor: getFaseColor(planta.fase_atual) }}
                >
                  {planta.fase_atual}
                </span>
              </div>
              <div className="info-row">
                <span>🪴 Vaso:</span>
                <span>{planta.vaso_litragem}L</span>
              </div>
              <div className="info-row">
                <span>🌿 Origem:</span>
                <span>{planta.origem}</span>
              </div>
            </div>
          </div>
        ))}

        {plantas.length === 0 && (
          <div className="empty-state">
            <p>🌱 Nenhuma planta cadastrada</p>
            <p>Adicione sua primeira planta para começar!</p>
          </div>
        )}
      </div>

      {/* Modal de Aviso - Sem Tendas */}
      {showNoTendaWarning && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>⚠️ Nenhuma Tenda Cadastrada</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNoTendaWarning(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-form">
              <p>Para adicionar uma planta, você precisa primeiro criar uma tenda de cultivo.</p>
              <p>Deseja criar sua primeira tenda agora?</p>
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowNoTendaWarning(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleCreateTenda}
                >
                  Criar Tenda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar/Editar Planta */}
      {showAddModal && renderPlantForm(false)}
      {showEditModal && renderPlantForm(true)}

      {/* Modal Check-in */}
      {showCheckinModal && selectedPlanta && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Check-in: {selectedPlanta.strain}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCheckinModal(false)}
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
                <div className="checkbox-group">
                  {tarefasDisponiveis.map(tarefa => (
                    <label key={tarefa} className="checkbox-item">
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
                  placeholder="Observações sobre o desenvolvimento, problemas encontrados, etc."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCheckinModal(false)}
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
    </div>
  );
};

export default PlantasManager;

