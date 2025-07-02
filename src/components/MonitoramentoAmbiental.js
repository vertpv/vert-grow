import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const MonitoramentoAmbiental = ({ user }) => {
  const [registros, setRegistros] = useState([]);
  const [tendas, setTendas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTenda, setSelectedTenda] = useState('');

  const [novoRegistro, setNovoRegistro] = useState({
    data_registro: new Date().toISOString().split('T')[0],
    temperatura: '',
    umidade: '',
    tenda_id: '',
    observacoes: ''
  });

  useEffect(() => {
    console.log('MonitoramentoAmbiental: useEffect acionado. User:', user);
    if (user?.id) {
      loadTendas();
      loadRegistros();
    }
  }, [user, selectedTenda]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('vert-grow-token');
    console.log('MonitoramentoAmbiental: getAuthHeaders - Token encontrado:', token ? 'Sim' : 'Não', 'Token:', token);
    
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`
    };
  };

  const loadTendas = async () => {
    console.log('MonitoramentoAmbiental: loadTendas - Iniciando carregamento de tendas.');
    try {
      if (!user?.id) {
        console.log('MonitoramentoAmbiental: loadTendas - Usuário não autenticado, não carregando tendas.');
        return;
      }
      console.log('MonitoramentoAmbiental: loadTendas - Carregando tendas para user.id:', user.id);
      
      const headers = getAuthHeaders();
      console.log('MonitoramentoAmbiental: loadTendas - Headers da requisição:', headers);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}`, {
        headers: headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setTendas(data);
        console.log('MonitoramentoAmbiental: loadTendas - Tendas carregadas com sucesso:', data);
        if (data.length > 0 && !selectedTenda) {
          setSelectedTenda(data[0].id.toString());
        }
      } else {
        const error = await response.text();
        console.error('MonitoramentoAmbiental: loadTendas - Erro ao carregar tendas:', response.status, error);
      }
    } catch (error) {
      console.error('MonitoramentoAmbiental: loadTendas - Erro ao carregar tendas:', error);
    }
  };

  const loadRegistros = async () => {
    console.log('MonitoramentoAmbiental: loadRegistros - Iniciando carregamento de registros.');
    try {
      if (!user?.id) {
        console.log('MonitoramentoAmbiental: loadRegistros - Usuário não autenticado, não carregando registros.');
        return;
      }
      console.log('MonitoramentoAmbiental: loadRegistros - Carregando registros para user.id:', user.id);
      
      let url = `${SUPABASE_URL}/rest/v1/registros_ambientais?user_id=eq.${user.id}`;
      if (selectedTenda) {
        url += `&tenda_id=eq.${selectedTenda}`;
      }
      url += '&order=data_registro.desc';
      console.log('MonitoramentoAmbiental: loadRegistros - URL da requisição:', url);

      const headers = getAuthHeaders();
      console.log('MonitoramentoAmbiental: loadRegistros - Headers da requisição:', headers);

      const response = await fetch(url, {
        headers: headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
        console.log('MonitoramentoAmbiental: loadRegistros - Registros carregados com sucesso:', data);
      } else {
        const error = await response.text();
        console.error('MonitoramentoAmbiental: loadRegistros - Erro ao carregar registros:', response.status, error);
      }
    } catch (error) {
      console.error('MonitoramentoAmbiental: loadRegistros - Erro ao carregar registros:', error);
    }
  };

  const handleAddRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        console.error('MonitoramentoAmbiental: handleAddRegistro - Usuário não autenticado');
        return;
      }

      const registroData = {
        ...novoRegistro,
        user_id: user.id,
        temperatura: parseFloat(novoRegistro.temperatura),
        umidade: parseFloat(novoRegistro.umidade),
        tenda_id: parseInt(novoRegistro.tenda_id),
        created_at: new Date().toISOString()
      };

      console.log('MonitoramentoAmbiental: handleAddRegistro - Dados do registro a serem enviados:', registroData);

      const headers = getAuthHeaders();
      console.log('MonitoramentoAmbiental: handleAddRegistro - Headers da requisição:', headers);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(registroData),
      });

      if (response.ok) {
        await loadRegistros();
        setShowAddModal(false);
        resetForm();
        console.log('MonitoramentoAmbiental: handleAddRegistro - Registro adicionado com sucesso.');
      } else {
        const error = await response.text();
        console.error('MonitoramentoAmbiental: handleAddRegistro - Erro ao adicionar registro:', response.status, error);
      }
    } catch (error) {
      console.error('MonitoramentoAmbiental: handleAddRegistro - Erro ao adicionar registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegistro = async (registroId) => {
    if (!window.confirm('Tem certeza que deseja remover este registro?')) return;

    try {
      const headers = getAuthHeaders();
      console.log('MonitoramentoAmbiental: handleDeleteRegistro - Headers da requisição:', headers);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais?id=eq.${registroId}`, {
        method: 'DELETE',
        headers: headers
      });

      if (response.ok) {
        await loadRegistros();
        console.log('MonitoramentoAmbiental: handleDeleteRegistro - Registro removido com sucesso.');
      } else {
        const error = await response.text();
        console.error('MonitoramentoAmbiental: handleDeleteRegistro - Erro ao remover registro:', response.status, error);
      }
    } catch (error) {
      console.error('MonitoramentoAmbiental: handleDeleteRegistro - Erro ao remover registro:', error);
    }
  };

  const resetForm = () => {
    setNovoRegistro({
      data_registro: new Date().toISOString().split('T')[0],
      temperatura: '',
      umidade: '',
      tenda_id: '',
      observacoes: ''
    });
  };

  const getTendaNome = (tendaId) => {
    const tenda = tendas.find(t => t.id === parseInt(tendaId));
    return tenda ? tenda.nome : 'Tenda não encontrada';
  };

  const getStatusTemperatura = (temp) => {
    if (temp < 20) return { status: 'baixa', color: '#2196F3', icon: '🥶' };
    if (temp > 30) return { status: 'alta', color: '#FF5722', icon: '🔥' };
    return { status: 'ideal', color: '#4CAF50', icon: '✅' };
  };

  const getStatusUmidade = (umidade) => {
    if (umidade < 40) return { status: 'baixa', color: '#FF9800', icon: '🏜️' };
    if (umidade > 70) return { status: 'alta', color: '#2196F3', icon: '💧' };
    return { status: 'ideal', color: '#4CAF50', icon: '✅' };
  };

  const calcularMedias = () => {
    if (registros.length === 0) return { temperatura: 0, umidade: 0 };
    
    const somaTemp = registros.reduce((acc, reg) => acc + reg.temperatura, 0);
    const somaUmidade = registros.reduce((acc, reg) => acc + reg.umidade, 0);
    
    return {
      temperatura: (somaTemp / registros.length).toFixed(1),
      umidade: (somaUmidade / registros.length).toFixed(1)
    };
  };

  const medias = calcularMedias();

  if (tendas.length === 0) {
    return (
      <div className="monitoramento-ambiental">
        <div className="page-header">
          <h2>🌡️ Monitoramento Ambiental</h2>
        </div>
        <div className="empty-state">
          <p>🏠 Nenhuma tenda cadastrada</p>
          <p>Crie uma tenda primeiro para monitorar o ambiente!</p>
          <button 
            className="btn-primary"
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: 'tendas' });
              window.dispatchEvent(event);
            }}
          >
            Criar Tenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoramento-ambiental">
      <div className="page-header">
        <h2>🌡️ Monitoramento Ambiental</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Novo Registro
        </button>
      </div>

      {/* Filtro por Tenda */}
      <div className="filter-section">
        <label>Filtrar por Tenda:</label>
        <select
          value={selectedTenda}
          onChange={(e) => setSelectedTenda(e.target.value)}
          className="tenda-filter"
        >
          <option value="">Todas as Tendas</option>
          {tendas.map(tenda => (
            <option key={tenda.id} value={tenda.id}>
              {tenda.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🌡️</span>
            <span className="stat-title">Temperatura Média</span>
          </div>
          <div className="stat-value">{medias.temperatura}°C</div>
          <div className="stat-status" style={{ color: getStatusTemperatura(parseFloat(medias.temperatura)).color }}>
            {getStatusTemperatura(parseFloat(medias.temperatura)).icon} {getStatusTemperatura(parseFloat(medias.temperatura)).status}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">💧</span>
            <span className="stat-title">Umidade Média</span>
          </div>
          <div className="stat-value">{medias.umidade}%</div>
          <div className="stat-status" style={{ color: getStatusUmidade(parseFloat(medias.umidade)).color }}>
            {getStatusUmidade(parseFloat(medias.umidade)).icon} {getStatusUmidade(parseFloat(medias.umidade)).status}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-title">Total de Registros</span>
          </div>
          <div className="stat-value">{registros.length}</div>
          <div className="stat-status">📈 registros</div>
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="registros-section">
        <h3>Histórico de Registros</h3>
        
        {registros.length === 0 ? (
          <div className="empty-state">
            <p>📊 Nenhum registro encontrado</p>
            <p>Adicione seu primeiro registro ambiental!</p>
          </div>
        ) : (
          <div className="registros-grid">
            {registros.map(registro => (
              <div key={registro.id} className="registro-card">
                <div className="registro-header">
                  <div className="registro-date">
                    📅 {new Date(registro.data_registro).toLocaleDateString('pt-BR')}
                  </div>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteRegistro(registro.id)}
                    title="Remover registro"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="registro-info">
                  <div className="info-row">
                    <span>🏠 Tenda:</span>
                    <span>{getTendaNome(registro.tenda_id)}</span>
                  </div>
                  <div className="info-row">
                    <span>🌡️ Temperatura:</span>
                    <span style={{ color: getStatusTemperatura(registro.temperatura).color }}>
                      {registro.temperatura}°C {getStatusTemperatura(registro.temperatura).icon}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>💧 Umidade:</span>
                    <span style={{ color: getStatusUmidade(registro.umidade).color }}>
                      {registro.umidade}% {getStatusUmidade(registro.umidade).icon}
                    </span>
                  </div>
                  {registro.observacoes && (
                    <div className="info-row">
                      <span>📝 Observações:</span>
                      <span>{registro.observacoes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Registro */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Novo Registro Ambiental</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRegistro} className="modal-form">
              <div className="form-group">
                <label>Data:</label>
                <input
                  type="date"
                  value={novoRegistro.data_registro}
                  onChange={(e) => setNovoRegistro({...novoRegistro, data_registro: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tenda:</label>
                <select
                  value={novoRegistro.tenda_id}
                  onChange={(e) => setNovoRegistro({...novoRegistro, tenda_id: e.target.value})}
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

              <div className="form-group">
                <label>Temperatura (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  value={novoRegistro.temperatura}
                  onChange={(e) => setNovoRegistro({...novoRegistro, temperatura: e.target.value})}
                  required
                  placeholder="Ex: 25.5"
                />
              </div>

              <div className="form-group">
                <label>Umidade (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={novoRegistro.umidade}
                  onChange={(e) => setNovoRegistro({...novoRegistro, umidade: e.target.value})}
                  required
                  placeholder="Ex: 60.0"
                />
              </div>

              <div className="form-group">
                <label>Observações:</label>
                <textarea
                  value={novoRegistro.observacoes}
                  onChange={(e) => setNovoRegistro({...novoRegistro, observacoes: e.target.value})}
                  placeholder="Observações sobre as condições ambientais..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
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
                  {loading ? 'Salvando...' : 'Salvar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoramentoAmbiental;


