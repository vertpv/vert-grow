import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  X, 
  Calendar, 
  FileText, 
  Camera, 
  Droplets, 
  Scissors, 
  Sprout,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const CheckinLote = ({ plantas, onClose, onSuccess, user }) => {
  const [checkinData, setCheckinData] = useState({
    data: new Date().toISOString().split('T')[0],
    tarefas_concluidas: [],
    observacoes: ''
  });
  
  const [plantasSelecionadas, setPlantasSelecionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '', visible: false });

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

  // Mostrar feedback visual
  const showFeedback = (type, message) => {
    setFeedback({ type, message, visible: true });
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const tarefasDisponiveis = [
    { id: 'rega', label: 'Rega', icon: Droplets },
    { id: 'poda', label: 'Poda', icon: Scissors },
    { id: 'foto', label: 'Foto', icon: Camera },
    { id: 'observacao', label: 'Observação', icon: FileText },
    { id: 'crescimento', label: 'Medição', icon: Sprout }
  ];

  const handlePlantaToggle = (plantaId) => {
    setPlantasSelecionadas(prev => 
      prev.includes(plantaId) 
        ? prev.filter(id => id !== plantaId)
        : [...prev, plantaId]
    );
  };

  const handleTarefaToggle = (tarefaId) => {
    setCheckinData(prev => ({
      ...prev,
      tarefas_concluidas: prev.tarefas_concluidas.includes(tarefaId)
        ? prev.tarefas_concluidas.filter(id => id !== tarefaId)
        : [...prev.tarefas_concluidas, tarefaId]
    }));
  };

  const handleSubmit = async () => {
    if (plantasSelecionadas.length === 0) {
      showFeedback('error', 'Selecione pelo menos uma planta para fazer check-in');
      return;
    }

    if (checkinData.tarefas_concluidas.length === 0) {
      showFeedback('error', 'Selecione pelo menos uma tarefa realizada');
      return;
    }

    setLoading(true);
    let sucessos = 0;
    let erros = 0;

    try {
      const headers = getAuthHeaders();
      
      for (const plantaId of plantasSelecionadas) {
        try {
          const checkinDataForPlanta = {
            planta_id: plantaId,
            user_id: user.id,
            data: checkinData.data,
            tarefas_concluidas: JSON.stringify(checkinData.tarefas_concluidas),
            observacoes: checkinData.observacoes || null,
            created_at: new Date().toISOString()
          };

          console.log('CheckinLote: Enviando dados para planta', plantaId, ':', checkinDataForPlanta);

          const response = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(checkinDataForPlanta),
          });

          if (response.ok) {
            sucessos++;
            console.log(`CheckinLote: Check-in salvo com sucesso para planta ${plantaId}`);
          } else {
            const errorText = await response.text();
            console.error(`CheckinLote: Erro ao salvar check-in para planta ${plantaId}:`, errorText);
            erros++;
          }
        } catch (error) {
          console.error(`CheckinLote: Erro ao processar planta ${plantaId}:`, error);
          erros++;
        }
      }

      // Mostrar feedback baseado nos resultados
      if (sucessos > 0 && erros === 0) {
        showFeedback('success', `✅ Check-in realizado com sucesso em ${sucessos} planta${sucessos > 1 ? 's' : ''}!`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else if (sucessos > 0 && erros > 0) {
        showFeedback('warning', `⚠️ Check-in parcial: ${sucessos} sucesso${sucessos > 1 ? 's' : ''}, ${erros} erro${erros > 1 ? 's' : ''}`);
      } else {
        showFeedback('error', `❌ Falha ao realizar check-in em todas as plantas selecionadas`);
      }

    } catch (error) {
      console.error('CheckinLote: Erro geral:', error);
      showFeedback('error', '❌ Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Check-in em Lote</h2>
            <p className="text-sm text-gray-600">Registre atividades para múltiplas plantas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback Visual */}
        {feedback.visible && (
          <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center gap-3 ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> :
             feedback.type === 'warning' ? <AlertCircle size={20} /> :
             <AlertCircle size={20} />}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Data do Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Data do Check-in
            </label>
            <input
              type="date"
              value={checkinData.data}
              onChange={(e) => setCheckinData(prev => ({ ...prev, data: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Seleção de Plantas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecionar Plantas ({plantasSelecionadas.length} selecionada{plantasSelecionadas.length !== 1 ? 's' : ''})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {plantas.map(planta => (
                <div
                  key={planta.id}
                  onClick={() => handlePlantaToggle(planta.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    plantasSelecionadas.includes(planta.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{planta.strain}</p>
                      <p className="text-sm text-gray-600">{planta.idade_dias} dias • {planta.tenda_nome || 'Sem tenda'}</p>
                    </div>
                    {plantasSelecionadas.includes(planta.id) && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarefas Realizadas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tarefas Realizadas ({checkinData.tarefas_concluidas.length} selecionada{checkinData.tarefas_concluidas.length !== 1 ? 's' : ''})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tarefasDisponiveis.map(tarefa => {
                const Icon = tarefa.icon;
                const isSelected = checkinData.tarefas_concluidas.includes(tarefa.id);
                
                return (
                  <button
                    key={tarefa.id}
                    onClick={() => handleTarefaToggle(tarefa.id)}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon size={20} className="mx-auto mb-1" />
                    <p className="text-sm font-medium">{tarefa.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Observações (opcional)
            </label>
            <textarea
              value={checkinData.observacoes}
              onChange={(e) => setCheckinData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Adicione observações sobre o estado das plantas..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || plantasSelecionadas.length === 0 || checkinData.tarefas_concluidas.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Realizar Check-in
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckinLote;

