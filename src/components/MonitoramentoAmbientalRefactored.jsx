import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Thermometer, 
  Droplets, 
  Calendar, 
  Home, 
  Eye, 
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Modal, ModalFooter } from './ui/modal';
import { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoStat } from './ui/bento-grid';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const MonitoramentoAmbientalRefactored = ({ user }) => {
  const [registros, setRegistros] = useState([]);
  const [tendas, setTendas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTenda, setSelectedTenda] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    data_registro: new Date().toISOString().split('T')[0],
    temperatura: '',
    umidade: '',
    tenda_id: '',
    observacoes: ''
  });

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

  const loadTendas = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}&order=created_at.desc`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setTendas(data);
        if (data.length > 0 && !selectedTenda) {
          setSelectedTenda(data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tendas:', error);
    }
  }, [user?.id, getAuthHeaders, selectedTenda]);

  const loadRegistros = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      let url = `${SUPABASE_URL}/rest/v1/registros_ambientais?user_id=eq.${user.id}`;
      if (selectedTenda) {
        url += `&tenda_id=eq.${selectedTenda}`;
      }
      url += '&order=data_registro.desc';

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  }, [user?.id, selectedTenda, getAuthHeaders]);

  useEffect(() => {
    if (user?.id) {
      loadTendas();
    }
  }, [user?.id, loadTendas]);

  useEffect(() => {
    if (user?.id) {
      loadRegistros();
    }
  }, [user?.id, selectedTenda, loadRegistros]);

  const resetForm = () => {
    setFormData({
      data_registro: new Date().toISOString().split('T')[0],
      temperatura: '',
      umidade: '',
      tenda_id: '',
      observacoes: ''
    });
    setCurrentStep(1);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (registro) => {
    setEditingRegistro(registro);
    setFormData({
      data_registro: registro.data_registro,
      temperatura: registro.temperatura.toString(),
      umidade: registro.umidade.toString(),
      tenda_id: registro.tenda_id.toString(),
      observacoes: registro.observacoes || ''
    });
    setCurrentStep(1);
    setShowEditModal(true);
  };

  const handleAddRegistro = async () => {
    if (!user?.id || !formData.temperatura || !formData.umidade || !formData.tenda_id) return;

    setLoading(true);
    try {
      const registroData = {
        ...formData,
        temperatura: parseFloat(formData.temperatura),
        umidade: parseFloat(formData.umidade),
        tenda_id: parseInt(formData.tenda_id),
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(registroData),
      });

      if (response.ok) {
        await loadRegistros();
        setShowAddModal(false);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao adicionar registro:', response.status, error);
      }
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRegistro = async () => {
    if (!editingRegistro?.id) return;

    setLoading(true);
    try {
      const registroData = {
        ...formData,
        temperatura: parseFloat(formData.temperatura),
        umidade: parseFloat(formData.umidade),
        tenda_id: parseInt(formData.tenda_id),
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais?id=eq.${editingRegistro.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(registroData),
      });

      if (response.ok) {
        await loadRegistros();
        setShowEditModal(false);
        setEditingRegistro(null);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao editar registro:', response.status, error);
      }
    } catch (error) {
      console.error('Erro ao editar registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegistro = async (registroId) => {
    if (!window.confirm('Tem certeza que deseja remover este registro?')) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais?id=eq.${registroId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        await loadRegistros();
      }
    } catch (error) {
      console.error('Erro ao remover registro:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = formData.temperatura !== '' && formData.umidade !== '' && formData.tenda_id !== '';
  const canProceedStep2 = true;

  const canProceed = currentStep === 1 ? canProceedStep1 : canProceedStep2;

  const getTemperatureIcon = (temp) => {
    if (temp >= 28) return <TrendingUp className="text-red-500" size={16} />;
    if (temp <= 18) return <TrendingDown className="text-blue-500" size={16} />;
    return <Minus className="text-green-500" size={16} />;
  };

  const getHumidityIcon = (humidity) => {
    if (humidity >= 70) return <TrendingUp className="text-blue-500" size={16} />;
    if (humidity <= 40) return <TrendingDown className="text-orange-500" size={16} />;
    return <Minus className="text-green-500" size={16} />;
  };

  const renderAddEditModalStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">🌡️ Dados Ambientais</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Data do Registro *</label>
              <input
                type="date"
                className="input w-full"
                value={formData.data_registro}
                onChange={(e) => setFormData({...formData, data_registro: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Tenda *</label>
              <select
                className="input w-full"
                value={formData.tenda_id}
                onChange={(e) => setFormData({...formData, tenda_id: e.target.value})}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Temperatura (°C) *</label>
                <input
                  type="number"
                  className="input w-full"
                  value={formData.temperatura}
                  onChange={(e) => setFormData({...formData, temperatura: e.target.value})}
                  placeholder="Ex: 24.5"
                  step="0.1"
                  min="0"
                  max="50"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Umidade (%) *</label>
                <input
                  type="number"
                  className="input w-full"
                  value={formData.umidade}
                  onChange={(e) => setFormData({...formData, umidade: e.target.value})}
                  placeholder="Ex: 65"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">📝 Observações</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Observações (opcional)</label>
              <textarea
                className="input w-full"
                rows={4}
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Adicione observações sobre as condições ambientais, problemas identificados, etc."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRegistroCard = (registro) => {
    const tenda = tendas.find(t => t.id === registro.tenda_id);
    const dataFormatada = new Date(registro.data_registro).toLocaleDateString('pt-BR');
    
    return (
      <BentoCard key={registro.id} className="relative">
        <BentoHeader
          title={`${dataFormatada}`}
          subtitle={tenda ? tenda.nome : 'Tenda não encontrada'}
          icon={Calendar}
          action={
            <div className="flex gap-2">
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => openEditModal(registro)}
              >
                <Edit size={16} />
              </button>
              <button 
                className="btn btn-sm btn-outline text-red-600"
                onClick={() => handleDeleteRegistro(registro.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          }
        />
        
        <BentoContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <BentoStat 
                label="Temperatura" 
                value={`${registro.temperatura}°C`} 
                icon={Thermometer}
                extra={getTemperatureIcon(registro.temperatura)}
              />
              <BentoStat 
                label="Umidade" 
                value={`${registro.umidade}%`} 
                icon={Droplets}
                extra={getHumidityIcon(registro.umidade)}
              />
            </div>
            
            {registro.observacoes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{registro.observacoes}</p>
              </div>
            )}
          </div>
        </BentoContent>
      </BentoCard>
    );
  };

  const calcularEstatisticas = () => {
    if (registros.length === 0) return { tempMedia: 0, umidadeMedia: 0, totalRegistros: 0 };
    
    const tempMedia = registros.reduce((acc, r) => acc + r.temperatura, 0) / registros.length;
    const umidadeMedia = registros.reduce((acc, r) => acc + r.umidade, 0) / registros.length;
    
    return {
      tempMedia: tempMedia.toFixed(1),
      umidadeMedia: umidadeMedia.toFixed(1),
      totalRegistros: registros.length
    };
  };

  const stats = calcularEstatisticas();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Monitoramento Ambiental</h1>
          <p className="text-muted-foreground">Acompanhe temperatura e umidade das suas tendas</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          Novo Registro
        </button>
      </div>

      {/* Filtro por Tenda */}
      {tendas.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Filtrar por tenda:</label>
          <select
            className="input w-auto"
            value={selectedTenda}
            onChange={(e) => setSelectedTenda(e.target.value)}
          >
            <option value="">Todas as tendas</option>
            {tendas.map(tenda => (
              <option key={tenda.id} value={tenda.id}>
                {tenda.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Estatísticas */}
      <BentoGrid>
        <BentoCard span={1}>
          <BentoStat 
            label="Total de Registros" 
            value={stats.totalRegistros} 
            icon={Eye}
          />
        </BentoCard>
        <BentoCard span={1}>
          <BentoStat 
            label="Temperatura Média" 
            value={`${stats.tempMedia}°C`} 
            icon={Thermometer}
          />
        </BentoCard>
        <BentoCard span={1}>
          <BentoStat 
            label="Umidade Média" 
            value={`${stats.umidadeMedia}%`} 
            icon={Droplets}
          />
        </BentoCard>
      </BentoGrid>

      {/* Lista de Registros */}
      <BentoGrid>
        {registros.length === 0 ? (
          <BentoCard span={4} className="text-center py-12">
            <Thermometer size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum registro encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {selectedTenda ? 'Não há registros para esta tenda' : 'Comece adicionando seu primeiro registro ambiental'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={openAddModal}
            >
              <Plus size={16} />
              Adicionar Primeiro Registro
            </button>
          </BentoCard>
        ) : (
          registros.map(renderRegistroCard)
        )}
      </BentoGrid>

      {/* Modal Adicionar Registro */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Novo Registro Ambiental"
        icon={Plus}
        size="md"
        showProgress={true}
        currentStep={currentStep}
        totalSteps={2}
        stepLabel={
          currentStep === 1 ? 'Dados de temperatura e umidade' :
          'Observações adicionais'
        }
        footer={
          <ModalFooter
            onCancel={() => setShowAddModal(false)}
            onNext={nextStep}
            onPrevious={prevStep}
            onConfirm={handleAddRegistro}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === 2}
            canProceed={canProceed}
            loading={loading}
            confirmText="Adicionar Registro"
          />
        }
      >
        {renderAddEditModalStep()}
      </Modal>

      {/* Modal Editar Registro */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Registro Ambiental"
        icon={Edit}
        size="md"
        showProgress={true}
        currentStep={currentStep}
        totalSteps={2}
        stepLabel={
          currentStep === 1 ? 'Dados de temperatura e umidade' :
          'Observações adicionais'
        }
        footer={
          <ModalFooter
            onCancel={() => setShowEditModal(false)}
            onNext={nextStep}
            onPrevious={prevStep}
            onConfirm={handleEditRegistro}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === 2}
            canProceed={canProceed}
            loading={loading}
            confirmText="Salvar Alterações"
          />
        }
      >
        {renderAddEditModalStep()}
      </Modal>
    </div>
  );
};

export default MonitoramentoAmbientalRefactored;

