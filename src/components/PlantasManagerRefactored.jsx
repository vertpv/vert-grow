import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Users, 
  Sprout,
  Home,
  Calendar,
  Droplets,
  Scissors,
  Eye,
  Lightbulb
} from 'lucide-react';
import { Modal, ModalFooter } from './ui/modal';
import { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoFooter, BentoStat, BentoList } from './ui/bento-grid';
import CheckinLote from './CheckinLote';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const PlantasManagerRefactored = ({ user }) => {
  // Estados principais
  const [plantas, setPlantas] = useState([]);
  const [tendas, setTendas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckinLote, setShowCheckinLote] = useState(false);

  // Estados de dados
  const [selectedPlanta, setSelectedPlanta] = useState(null);
  const [editingPlanta, setEditingPlanta] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
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

  // Estado para feedback visual
  const [feedback, setFeedback] = useState({ type: '', message: '', visible: false });

  // Configurações
  const tarefasDisponiveis = [
    { id: 'rega', label: 'Rega', icon: Droplets },
    { id: 'poda', label: 'Poda', icon: Scissors },
    { id: 'inspecao', label: 'Inspeção', icon: Eye },
    { id: 'fertilizacao', label: 'Fertilização', icon: CheckCircle },
    { id: 'lst', label: 'LST', icon: Edit },
    { id: 'defoliacao', label: 'Defoliação', icon: Scissors },
    { id: 'ph', label: 'Medição pH', icon: Droplets },
    { id: 'tricomas', label: 'Verificação Tricomas', icon: Eye },
    { id: 'luz', label: 'Ajuste de Luz', icon: Lightbulb },
    { id: 'umidade', label: 'Controle Umidade', icon: Droplets }
  ];

  // Headers de autenticação
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

  // Carregamento de dados
  const loadPlantas = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/plantas?user_id=eq.${user.id}&select=*,tendas(nome)&order=created_at.desc`, 
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        const data = await response.json();
        const plantasComIdade = data.map(planta => ({
          ...planta,
          idade_dias: planta.data_plantio ? 
            Math.floor((new Date() - new Date(planta.data_plantio)) / (1000 * 60 * 60 * 24)) : 0,
          tenda_nome: planta.tendas?.nome || 'Sem tenda'
        }));
        setPlantas(plantasComIdade);
      }
    } catch (error) {
      console.error('Erro ao carregar plantas:', error);
    }
  }, [user?.id, getAuthHeaders]);

  const loadTendas = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${user.id}&order=created_at.desc`, 
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        const data = await response.json();
        setTendas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tendas:', error);
    }
  }, [user?.id, getAuthHeaders]);

  // Efeitos
  useEffect(() => {
    if (user?.id) {
      loadPlantas();
      loadTendas();
    }
  }, [user?.id, loadPlantas, loadTendas]);

  // Funções de manipulação de formulário
  const resetForm = () => {
    setFormData({
      strain: '',
      origem: '',
      data_plantio: '',
      data_germinacao: '',
      vaso_litragem: 10,
      fase_atual: 'germinacao',
      tenda_id: ''
    });
    setCurrentStep(1);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (planta) => {
    setEditingPlanta(planta);
    setFormData({
      strain: planta.strain,
      origem: planta.origem || '',
      data_plantio: planta.data_plantio || '',
      data_germinacao: planta.data_germinacao || '',
      vaso_litragem: planta.vaso_litragem,
      fase_atual: planta.fase_atual,
      tenda_id: planta.tenda_id || ''
    });
    setCurrentStep(1);
    setShowEditModal(true);
  };

  const openCheckinModal = (planta) => {
    setSelectedPlanta(planta);
    setCheckinData({
      data: new Date().toISOString().split('T')[0],
      tarefas_concluidas: [],
      observacoes: ''
    });
    setShowCheckinModal(true);
  };

  // Funções CRUD
  const handleAddPlanta = async () => {
    if (!user?.id || !formData.strain) return;

    setLoading(true);
    try {
      const plantaData = {
        ...formData,
        user_id: user.id,
        tenda_id: formData.tenda_id || null,
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
      }
    } catch (error) {
      console.error('Erro ao adicionar planta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlanta = async () => {
    if (!editingPlanta?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/plantas?id=eq.${editingPlanta.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...formData,
          tenda_id: formData.tenda_id || null,
          updated_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        await loadPlantas();
        setShowEditModal(false);
        setEditingPlanta(null);
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao editar planta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlanta = async (plantaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta planta?')) return;

    try {
      // Remover check-ins primeiro
      await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta?planta_id=eq.${plantaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      // Remover planta
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

  const handleCheckin = async () => {
    if (!selectedPlanta?.id || checkinData.tarefas_concluidas.length === 0) {
      setFeedback({ type: 'error', message: 'Selecione pelo menos uma tarefa para fazer check-in', visible: true });
      setTimeout(() => setFeedback(prev => ({ ...prev, visible: false })), 4000);
      return;
    }

    setLoading(true);
    try {
      const checkinDataWithUser = {
        planta_id: selectedPlanta.id,
        user_id: user.id,
        data: checkinData.data,
        tarefas_concluidas: JSON.stringify(checkinData.tarefas_concluidas),
        observacoes: checkinData.observacoes || null,
        created_at: new Date().toISOString()
      };

      console.log('PlantasManager: Enviando check-in:', checkinDataWithUser);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(checkinDataWithUser),
      });

      if (response.ok) {
        console.log('PlantasManager: Check-in salvo com sucesso!');
        setFeedback({ type: 'success', message: '✅ Check-in realizado com sucesso!', visible: true });
        setTimeout(() => {
          setFeedback(prev => ({ ...prev, visible: false }));
          setShowCheckinModal(false);
          setSelectedPlanta(null);
        }, 2000);
        await loadPlantas();
      } else {
        const errorText = await response.text();
        console.error('PlantasManager: Erro ao salvar check-in:', errorText);
        setFeedback({ type: 'error', message: '❌ Erro ao salvar check-in. Tente novamente.', visible: true });
        setTimeout(() => setFeedback(prev => ({ ...prev, visible: false })), 4000);
      }
    } catch (error) {
      console.error('PlantasManager: Erro ao fazer check-in:', error);
      setFeedback({ type: 'error', message: '❌ Erro interno. Tente novamente.', visible: true });
      setTimeout(() => setFeedback(prev => ({ ...prev, visible: false })), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Funções de navegação do modal
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = formData.strain.trim() !== '';
  const canProceedStep2 = true;
  const canProceedStep3 = true;

  const canProceed = currentStep === 1 ? canProceedStep1 : 
                    currentStep === 2 ? canProceedStep2 : canProceedStep3;

  // Funções de renderização
  const getFaseBadge = (fase) => {
    const badges = {
      germinacao: { color: '#4CAF50', text: '🌱 Germinação' },
      vegetativa: { color: '#2196F3', text: '🌿 Vegetativa' },
      floracao: { color: '#FF9800', text: '🌸 Floração' }
    };
    return badges[fase] || badges.germinacao;
  };

  const renderPlantaCard = (planta) => {
    const badge = getFaseBadge(planta.fase_atual);
    
    return (
      <BentoCard key={planta.id} className="relative">
        <BentoHeader
          title={planta.strain}
          subtitle={`${planta.idade_dias} dias • ${planta.tenda_nome}`}
          icon={Sprout}
          action={
            <div className="flex gap-2">
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => openCheckinModal(planta)}
              >
                <CheckCircle size={16} />
              </button>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => openEditModal(planta)}
              >
                <Edit size={16} />
              </button>
              <button 
                className="btn btn-sm btn-outline text-red-600"
                onClick={() => handleDeletePlanta(planta.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          }
        />
        
        <BentoContent>
          <div className="space-y-3">
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: badge.color + '20', 
                color: badge.color 
              }}
            >
              {badge.text}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <BentoStat 
                label="Origem" 
                value={planta.origem || 'N/A'} 
                icon={Sprout}
              />
              <BentoStat 
                label="Vaso" 
                value={`${planta.vaso_litragem}L`} 
                icon={Home}
              />
            </div>
            
            {planta.data_plantio && (
              <BentoStat 
                label="Plantio" 
                value={new Date(planta.data_plantio).toLocaleDateString('pt-BR')} 
                icon={Calendar}
              />
            )}
          </div>
        </BentoContent>
      </BentoCard>
    );
  };

  const renderAddPlantaStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">📝 Informações Básicas</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Strain *</label>
              <input
                type="text"
                className="input w-full"
                value={formData.strain}
                onChange={(e) => setFormData({...formData, strain: e.target.value})}
                placeholder="Ex: White Widow, OG Kush"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Origem</label>
              <select
                className="input w-full"
                value={formData.origem}
                onChange={(e) => setFormData({...formData, origem: e.target.value})}
              >
                <option value="">Selecione a origem</option>
                <option value="Semente">🌰 Semente</option>
                <option value="Clone">🌿 Clone</option>
                <option value="Mudas">🌱 Mudas</option>
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Fase Atual</label>
              <select
                className="input w-full"
                value={formData.fase_atual}
                onChange={(e) => setFormData({...formData, fase_atual: e.target.value})}
              >
                <option value="germinacao">🌱 Germinação</option>
                <option value="vegetativa">🌿 Vegetativa</option>
                <option value="floracao">🌸 Floração</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">📅 Datas e Cronograma</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Data de Plantio</label>
                <input
                  type="date"
                  className="input w-full"
                  value={formData.data_plantio}
                  onChange={(e) => setFormData({...formData, data_plantio: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Data de Germinação</label>
                <input
                  type="date"
                  className="input w-full"
                  value={formData.data_germinacao}
                  onChange={(e) => setFormData({...formData, data_germinacao: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Litragem do Vaso</label>
              <select
                className="input w-full"
                value={formData.vaso_litragem}
                onChange={(e) => setFormData({...formData, vaso_litragem: parseInt(e.target.value)})}
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
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">🏠 Localização</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Tenda de Cultivo</label>
              <select
                className="input w-full"
                value={formData.tenda_id}
                onChange={(e) => setFormData({...formData, tenda_id: e.target.value})}
              >
                <option value="">🌿 Sem tenda (cultivo livre)</option>
                {tendas.map(tenda => (
                  <option key={tenda.id} value={tenda.id}>
                    🏠 {tenda.nome} ({tenda.dimensoes})
                  </option>
                ))}
              </select>
            </div>
            
            {formData.tenda_id && (
              <div className="bg-secondary p-4 rounded-lg">
                {(() => {
                  const tenda = tendas.find(t => t.id === parseInt(formData.tenda_id));
                  return tenda ? (
                    <div className="space-y-2 text-sm">
                      <div><strong>Dimensões:</strong> {tenda.dimensoes}</div>
                      <div><strong>LED:</strong> {tenda.watts}W {tenda.modelo_led}</div>
                      <div><strong>Altura:</strong> {tenda.altura}cm</div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderCheckinModal = () => {
    return (
      <div className="space-y-4">
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-medium">{selectedPlanta?.strain}</h4>
          <p className="text-sm text-muted-foreground">
            {selectedPlanta?.fase_atual} • {selectedPlanta?.tenda_nome}
          </p>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Data do Check-in</label>
          <input
            type="date"
            className="input w-full"
            value={checkinData.data}
            onChange={(e) => setCheckinData({...checkinData, data: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Tarefas Realizadas</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tarefasDisponiveis.map(tarefa => {
              const Icon = tarefa.icon;
              const isSelected = checkinData.tarefas_concluidas.includes(tarefa.id);
              
              return (
                <button
                  key={tarefa.id}
                  type="button"
                  className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:bg-secondary'
                  }`}
                  onClick={() => {
                    const newTarefas = isSelected
                      ? checkinData.tarefas_concluidas.filter(t => t !== tarefa.id)
                      : [...checkinData.tarefas_concluidas, tarefa.id];
                    setCheckinData({...checkinData, tarefas_concluidas: newTarefas});
                  }}
                >
                  <Icon size={20} />
                  <span className="text-xs text-center">{tarefa.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium mb-2">Observações</label>
          <textarea
            className="input w-full"
            rows={3}
            value={checkinData.observacoes}
            onChange={(e) => setCheckinData({...checkinData, observacoes: e.target.value})}
            placeholder="Adicione observações sobre este check-in..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Feedback Visual */}
      {feedback.visible && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={20} /> :
           feedback.type === 'warning' ? <Eye size={20} /> :
           <Eye size={20} />}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plantas</h1>
          <p className="text-muted-foreground">Gerencie suas plantas de cultivo</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn-outline"
            onClick={() => setShowCheckinLote(true)}
          >
            <Users size={16} />
            Check-in em Lote
          </button>
          <button 
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            Nova Planta
          </button>
        </div>
      </div>

      {/* Stats */}
      <BentoGrid>
        <BentoCard span={1}>
          <BentoStat 
            label="Total de Plantas" 
            value={plantas.length} 
            icon={Sprout}
          />
        </BentoCard>
        <BentoCard span={1}>
          <BentoStat 
            label="Em Germinação" 
            value={plantas.filter(p => p.fase_atual === 'germinacao').length} 
            icon={Sprout}
          />
        </BentoCard>
        <BentoCard span={1}>
          <BentoStat 
            label="Vegetativa" 
            value={plantas.filter(p => p.fase_atual === 'vegetativa').length} 
            icon={Sprout}
          />
        </BentoCard>
        <BentoCard span={1}>
          <BentoStat 
            label="Floração" 
            value={plantas.filter(p => p.fase_atual === 'floracao').length} 
            icon={Sprout}
          />
        </BentoCard>
      </BentoGrid>

      {/* Lista de Plantas */}
      <BentoGrid>
        {plantas.length === 0 ? (
          <BentoCard span={4} className="text-center py-12">
            <Sprout size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhuma planta cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando sua primeira planta de cultivo
            </p>
            <button 
              className="btn btn-primary"
              onClick={openAddModal}
            >
              <Plus size={16} />
              Adicionar Primeira Planta
            </button>
          </BentoCard>
        ) : (
          plantas.map(renderPlantaCard)
        )}
      </BentoGrid>

      {/* Modal Adicionar Planta */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nova Planta"
        icon={Plus}
        size="md"
        showProgress={true}
        currentStep={currentStep}
        totalSteps={3}
        stepLabel={
          currentStep === 1 ? 'Informações básicas da planta' :
          currentStep === 2 ? 'Datas e cronograma' :
          'Localização e tenda'
        }
        footer={
          <ModalFooter
            onCancel={() => setShowAddModal(false)}
            onNext={nextStep}
            onPrevious={prevStep}
            onConfirm={handleAddPlanta}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === 3}
            canProceed={canProceed}
            loading={loading}
            confirmText="Adicionar Planta"
          />
        }
      >
        {renderAddPlantaStep()}
      </Modal>

      {/* Modal Editar Planta */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Planta"
        icon={Edit}
        size="md"
        showProgress={true}
        currentStep={currentStep}
        totalSteps={3}
        stepLabel={
          currentStep === 1 ? 'Informações básicas da planta' :
          currentStep === 2 ? 'Datas e cronograma' :
          'Localização e tenda'
        }
        footer={
          <ModalFooter
            onCancel={() => setShowEditModal(false)}
            onNext={nextStep}
            onPrevious={prevStep}
            onConfirm={handleEditPlanta}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === 3}
            canProceed={canProceed}
            loading={loading}
            confirmText="Salvar Alterações"
          />
        }
      >
        {renderAddPlantaStep()}
      </Modal>

      {/* Modal Check-in */}
      <Modal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        title="Check-in da Planta"
        icon={CheckCircle}
        size="md"
        footer={
          <div className="flex justify-between">
            <button 
              className="btn btn-outline"
              onClick={() => setShowCheckinModal(false)}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleCheckin}
              disabled={loading || checkinData.tarefas_concluidas.length === 0}
            >
              {loading ? 'Salvando...' : 'Salvar Check-in'}
            </button>
          </div>
        }
      >
        {renderCheckinModal()}
      </Modal>

      {/* Modal Check-in em Lote */}
      {showCheckinLote && (
        <CheckinLote
          user={user}
          onClose={() => setShowCheckinLote(false)}
          onSuccess={() => {
            loadPlantas();
            setShowCheckinLote(false);
          }}
        />
      )}
    </div>
  );
};

export default PlantasManagerRefactored;

