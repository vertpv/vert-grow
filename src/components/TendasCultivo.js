import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const TendasCultivo = ({ user }) => {
  const [tendas, setTendas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTenda, setEditingTenda] = useState(null);
  const [loading, setLoading] = useState(false);

  const [novaTenda, setNovaTenda] = useState({
    nome: '',
    dimensoes: '80x80',
    altura: 200,
    watts: 240,
    modelo_led: 'LM301h',
    quantidade_paineis: 1,
    altura_luz: 60,
    limite_plantas: 4
  });

  const dimensoesOpcoes = [
    { value: '40x40', label: '40x40 cm', limite: 1 },
    { value: '60x60', label: '60x60 cm', limite: 2 },
    { value: '80x80', label: '80x80 cm', limite: 4 },
    { value: '100x100', label: '100x100 cm', limite: 6 },
    { value: '120x120', label: '120x120 cm', limite: 9 },
    { value: '150x150', label: '150x150 cm', limite: 12 }
  ];

  const modelosLed = [
    'LM301h',
    'LM301b', 
    '281b',
    'Bridgelux',
    'Epistar',
    'Outro'
  ];

  useEffect(() => {
    loadTendas();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('vert-grow-token');
    console.log('Token encontrado:', token ? 'Sim' : 'Não');
    
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`
    };
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

  const handleAddTenda = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        console.error('Usuário não autenticado');
        return;
      }

      const tendaData = {
        ...novaTenda,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(tendaData),
      });

      if (response.ok) {
        await loadTendas();
        setShowAddModal(false);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao adicionar tenda:', error);
      }
    } catch (error) {
      console.error('Erro ao adicionar tenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTenda = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?id=eq.${editingTenda.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(novaTenda),
      });

      if (response.ok) {
        await loadTendas();
        setShowEditModal(false);
        setEditingTenda(null);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao editar tenda:', error);
      }
    } catch (error) {
      console.error('Erro ao editar tenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenda = async (tendaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta tenda?')) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?id=eq.${tendaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        await loadTendas();
      }
    } catch (error) {
      console.error('Erro ao remover tenda:', error);
    }
  };

  const openEditModal = (tenda) => {
    setEditingTenda(tenda);
    setNovaTenda({
      nome: tenda.nome,
      dimensoes: tenda.dimensoes,
      altura: tenda.altura,
      watts: tenda.watts,
      modelo_led: tenda.modelo_led,
      quantidade_paineis: tenda.quantidade_paineis,
      altura_luz: tenda.altura_luz,
      limite_plantas: tenda.limite_plantas
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setNovaTenda({
      nome: '',
      dimensoes: '80x80',
      altura: 200,
      watts: 240,
      modelo_led: 'LM301h',
      quantidade_paineis: 1,
      altura_luz: 60,
      limite_plantas: 4
    });
  };

  const handleDimensoesChange = (dimensoes) => {
    const opcao = dimensoesOpcoes.find(o => o.value === dimensoes);
    setNovaTenda({
      ...novaTenda,
      dimensoes,
      limite_plantas: opcao ? opcao.limite : 4
    });
  };

  const calcularPPFD = (tenda) => {
    const [largura, comprimento] = tenda.dimensoes.split('x').map(d => parseInt(d));
    const area = (largura * comprimento) / 10000; // cm² para m²
    const ppfd = (tenda.watts * tenda.quantidade_paineis * 2.5) / area;
    return Math.round(ppfd);
  };

  const renderTendaVisual = (tenda) => {
    const cols = Math.ceil(Math.sqrt(tenda.limite_plantas));
    const slots = Array.from({ length: tenda.limite_plantas }, (_, i) => (
      <div key={i} className="plant-slot">
        <div className="plant-placeholder">🌱</div>
      </div>
    ));

    return (
      <div className="tenda-visual" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {slots}
      </div>
    );
  };

  const renderModal = (isEdit = false) => (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? 'Editar Tenda' : 'Nova Tenda'}</h3>
          <button 
            className="modal-close"
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
                setEditingTenda(null);
              } else {
                setShowAddModal(false);
              }
              resetForm();
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={isEdit ? handleEditTenda : handleAddTenda} className="modal-form">
          <div className="form-group">
            <label>Nome da Tenda:</label>
            <input
              type="text"
              value={novaTenda.nome}
              onChange={(e) => setNovaTenda({...novaTenda, nome: e.target.value})}
              required
              placeholder="Ex: Tenda Principal"
            />
          </div>

          <div className="form-group">
            <label>Dimensões:</label>
            <select
              value={novaTenda.dimensoes}
              onChange={(e) => handleDimensoesChange(e.target.value)}
            >
              {dimensoesOpcoes.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label} - até {opcao.limite} plantas
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Altura (cm):</label>
            <input
              type="number"
              value={novaTenda.altura}
              onChange={(e) => setNovaTenda({...novaTenda, altura: parseInt(e.target.value)})}
              min="100"
              max="300"
            />
          </div>

          <div className="form-group">
            <label>Modelo LED:</label>
            <select
              value={novaTenda.modelo_led}
              onChange={(e) => setNovaTenda({...novaTenda, modelo_led: e.target.value})}
            >
              {modelosLed.map(modelo => (
                <option key={modelo} value={modelo}>{modelo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Potência (W):</label>
            <input
              type="number"
              value={novaTenda.watts}
              onChange={(e) => setNovaTenda({...novaTenda, watts: parseInt(e.target.value)})}
              min="50"
              max="1000"
            />
          </div>

          <div className="form-group">
            <label>Quantidade de Painéis:</label>
            <input
              type="number"
              value={novaTenda.quantidade_paineis}
              onChange={(e) => setNovaTenda({...novaTenda, quantidade_paineis: parseInt(e.target.value)})}
              min="1"
              max="10"
            />
          </div>

          <div className="form-group">
            <label>Altura da Luz (cm):</label>
            <input
              type="number"
              value={novaTenda.altura_luz}
              onChange={(e) => setNovaTenda({...novaTenda, altura_luz: parseInt(e.target.value)})}
              min="20"
              max="100"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setEditingTenda(null);
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
              {loading ? (isEdit ? 'Salvando...' : 'Adicionando...') : (isEdit ? 'Salvar Alterações' : 'Adicionar Tenda')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="tendas-cultivo">
      <div className="page-header">
        <h2>🏠 Gestão de Tendas</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Nova Tenda
        </button>
      </div>

      <div className="tendas-grid">
        {tendas.map(tenda => (
          <div key={tenda.id} className="tenda-card">
            <div className="tenda-header">
              <h3>{tenda.nome}</h3>
              <div className="tenda-actions">
                <button 
                  className="btn-edit"
                  onClick={() => openEditModal(tenda)}
                  title="Editar tenda"
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteTenda(tenda.id)}
                  title="Remover tenda"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="tenda-info">
              <div className="info-row">
                <span>📏 Dimensões:</span>
                <span>{tenda.dimensoes} cm</span>
              </div>
              <div className="info-row">
                <span>📐 Altura:</span>
                <span>{tenda.altura} cm</span>
              </div>
              <div className="info-row">
                <span>💡 LED:</span>
                <span>{tenda.modelo_led} - {tenda.watts}W x{tenda.quantidade_paineis}</span>
              </div>
              <div className="info-row">
                <span>📊 PPFD:</span>
                <span>{calcularPPFD(tenda)} μmol/m²/s</span>
              </div>
              <div className="info-row">
                <span>🌱 Capacidade:</span>
                <span>{tenda.limite_plantas} plantas</span>
              </div>
            </div>

            {renderTendaVisual(tenda)}
          </div>
        ))}

        {tendas.length === 0 && (
          <div className="empty-state">
            <p>🏠 Nenhuma tenda cadastrada</p>
            <p>Adicione sua primeira tenda para começar!</p>
          </div>
        )}
      </div>

      {showAddModal && renderModal(false)}
      {showEditModal && renderModal(true)}
    </div>
  );
};

export default TendasCultivo;

