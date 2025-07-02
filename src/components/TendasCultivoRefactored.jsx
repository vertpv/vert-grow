import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Ruler, 
  Maximize2, 
  Zap, 
  Lightbulb, 
  Thermometer, 
  Droplets, 
  Leaf
} from 'lucide-react';
import { Modal, ModalFooter } from './ui/modal';
import { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoStat } from './ui/bento-grid';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const TendasCultivoRefactored = ({ user }) => {
  const [tendas, setTendas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTenda, setEditingTenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
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
      }
    } catch (error) {
      console.error('Erro ao carregar tendas:', error);
    }
  }, [user?.id, getAuthHeaders]);

  useEffect(() => {
    if (user?.id) {
      loadTendas();
    }
  }, [user?.id, loadTendas]);

  const resetForm = () => {
    setFormData({
      nome: '',
      dimensoes: '80x80',
      altura: 200,
      watts: 240,
      modelo_led: 'LM301h',
      quantidade_paineis: 1,
      altura_luz: 60,
      limite_plantas: 4
    });
    setCurrentStep(1);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (tenda) => {
    setEditingTenda(tenda);
    setFormData({
      nome: tenda.nome,
      dimensoes: tenda.dimensoes,
      altura: tenda.altura,
      watts: tenda.watts,
      modelo_led: tenda.modelo_led,
      quantidade_paineis: tenda.quantidade_paineis,
      altura_luz: tenda.altura_luz,
      limite_plantas: tenda.limite_plantas
    });
    setCurrentStep(1);
    setShowEditModal(true);
  };

  const handleAddTenda = async () => {
    if (!user?.id || !formData.nome) return;

    setLoading(true);
    try {
      const tendaData = {
        ...formData,
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
        console.error('Erro ao adicionar tenda:', response.status, error);
      }
    } catch (error) {
      console.error('Erro ao adicionar tenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTenda = async () => {
    if (!editingTenda?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?id=eq.${editingTenda.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...formData,
          updated_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        await loadTendas();
        setShowEditModal(false);
        setEditingTenda(null);
        resetForm();
      } else {
        const error = await response.text();
        console.error('Erro ao editar tenda:', response.status, error);
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

  const handleDimensoesChange = (dimensoes) => {
    const opcao = dimensoesOpcoes.find(o => o.value === dimensoes);
    setFormData({
      ...formData,
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

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = formData.nome.trim() !== '';
  const canProceedStep2 = true;

  const canProceed = currentStep === 1 ? canProceedStep1 : canProceedStep2;

  const renderAddEditModalStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">📝 Informações Básicas</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Nome da Tenda *</label>
              <input
                type="text"
                className="input w-full"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Tenda Principal"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Dimensões</label>
              <select
                className="input w-full"
                value={formData.dimensoes}
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
              <label className="block text-sm font-medium mb-2">Altura (cm)</label>
              <input
                type="number"
                className="input w-full"
                value={formData.altura}
                onChange={(e) => setFormData({...formData, altura: parseInt(e.target.value)})}
                min="100"
                max="300"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg mb-4">💡 Iluminação e Capacidade</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Modelo LED</label>
              <select
                className="input w-full"
                value={formData.modelo_led}
                onChange={(e) => setFormData({...formData, modelo_led: e.target.value})}
              >
                {modelosLed.map(modelo => (
                  <option key={modelo} value={modelo}>{modelo}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Potência (W)</label>
              <input
                type="number"
                className="input w-full"
                value={formData.watts}
                onChange={(e) => setFormData({...formData, watts: parseInt(e.target.value)})}
                min="50"
                max="1000"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Quantidade de Painéis</label>
              <input
                type="number"
                className="input w-full"
                value={formData.quantidade_paineis}
                onChange={(e) => setFormData({...formData, quantidade_paineis: parseInt(e.target.value)})}
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Altura da Luz (cm)</label>
              <input
                type="number"
                className="input w-full"
                value={formData.altura_luz}
                onChange={(e) => setFormData({...formData, altura_luz: parseInt(e.target.value)})}
                min="20"
                max="100"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTendaCard = (tenda) => {
    const ppfd = calcularPPFD(tenda);
    
    return (
      <BentoCard key={tenda.id} className="relative">
        <BentoHeader
          title={tenda.nome}
          subtitle={`${tenda.dimensoes} cm`}
          icon={Home}
          action={
            <div className="flex gap-2">
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => openEditModal(tenda)}
              >
                <Edit size={16} />
              </button>
              <button 
                className="btn btn-sm btn-outline text-red-600"
                onClick={() => handleDeleteTenda(tenda.id)}
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
                label="Altura" 
                value={`${tenda.altura} cm`} 
                icon={Maximize2}
              />
              <BentoStat 
                label="Capacidade" 
                value={`${tenda.limite_plantas} plantas`} 
                icon={Leaf}
              />
              <BentoStat 
                label="Potência LED" 
                value={`${tenda.watts}W x${tenda.quantidade_paineis}`} 
                icon={Zap}
              />
              <BentoStat 
                label="PPFD" 
                value={`${ppfd} μmol/m²/s`} 
                icon={Lightbulb}
              />
            </div>
          </div>
        </BentoContent>
      </BentoCard>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tendas</h1>
          <p className="text-muted-foreground">Gerencie suas tendas de cultivo</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          Nova Tenda
        </button>
      </div>

      {/* Lista de Tendas */}
      <BentoGrid>
        {tendas.length === 0 ? (
          <BentoCard span={4} className="text-center py-12">
            <Home size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhuma tenda cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Adicione sua primeira tenda para começar a organizar seu cultivo
            </p>
            <button 
              className="btn btn-primary"
              onClick={openAddModal}
            >
              <Plus size={16} />
              Adicionar Primeira Tenda
            </button>
          </BentoCard>
        ) : (
          tendas.map(renderTendaCard)
        )}
      </BentoGrid>

      {/* Modal Adicionar Tenda */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nova Tenda"
        icon={Plus}
        size="md"
        showProgress={true}
        currentStep={currentStep}
        totalSteps={2}
        stepLabel={
          currentStep === 1 ? 'Informações básicas da tenda' :
          'Iluminação e capacidade'
        }
        footer={
          <ModalFooter
            onCancel={() => setShowAddModal(false)}
            onNext={nextStep}
            onPrevious={prevStep}
            onConfirm={handleAddTenda}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === 2}
            canProceed={canProceed}
            loading={loading}
            confirmText="Adicionar Tenda"
          />
        }
      >
        {renderAddEditModalStep()}
      </Modal>

      {/* Modal Editar Tenda */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Tenda"
        icon={Edit}
        size="md"
        showProgress={true}
        currentStep={currentStep}
        totalSteps={2}
        stepLabel={
          currentStep === 1 ? 'Informações básicas da tenda' :
          'Iluminação e capacidade'
        }
        footer={
          <ModalFooter
            onCancel={() => setShowEditModal(false)}
            onNext={nextStep}
            onPrevious={prevStep}
            onConfirm={handleEditTenda}
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

export default TendasCultivoRefactored;


