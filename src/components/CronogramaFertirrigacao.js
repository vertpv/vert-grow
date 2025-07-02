import React, { useState } from 'react';

const CronogramaFertirrigacao = () => {
  const [selectedPhase, setSelectedPhase] = useState('vegetativa');

  const cronogramaData = {
    fase_vegetativa: [
      { semana: 1, solucao_final_litros: 4.8, concentrado_litros: 0.5 },
      { semana: 2, solucao_final_litros: 7.2, concentrado_litros: 0.7 },
      { semana: 3, solucao_final_litros: 9.6, concentrado_litros: 1.0 },
      { semana: 4, solucao_final_litros: 12.0, concentrado_litros: 1.2 }
    ],
    fase_floracao: [
      { semana: 5, solucao_final_litros: 12.0, concentrado_litros: 1.2 },
      { semana: 6, solucao_final_litros: 14.4, concentrado_litros: 1.4 },
      { semana: 7, solucao_final_litros: 14.4, concentrado_litros: 1.4 },
      { semana: 8, solucao_final_litros: 16.8, concentrado_litros: 1.7 },
      { semana: 9, solucao_final_litros: 16.8, concentrado_litros: 1.7 },
      { semana: 10, solucao_final_litros: 18.0, concentrado_litros: 1.8 },
      { semana: 11, solucao_final_litros: 18.0, concentrado_litros: 1.8 },
      { semana: 12, solucao_final_litros: 18.0, concentrado_litros: 1.8 }
    ]
  };

  const getCurrentData = () => {
    return selectedPhase === 'vegetativa' ? cronogramaData.fase_vegetativa : cronogramaData.fase_floracao;
  };

  const getPhaseInfo = () => {
    if (selectedPhase === 'vegetativa') {
      return {
        title: '🌱 Fase Vegetativa',
        subtitle: 'Semanas 1-4',
        nutrient: 'MAP (20g por 20L)',
        color: '#4CAF50',
        bgColor: '#E8F5E8'
      };
    } else {
      return {
        title: '🌸 Fase de Floração',
        subtitle: 'Semanas 5-12',
        nutrient: 'MKP (40g por 20L)',
        color: '#FF9800',
        bgColor: '#FFF3E0'
      };
    }
  };

  const phaseInfo = getPhaseInfo();
  const currentData = getCurrentData();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-icon">📅</span>
          <h2 className="card-title">Cronograma de Fertirrigação</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setSelectedPhase('vegetativa')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              background: selectedPhase === 'vegetativa' ? '#4CAF50' : '#f5f5f5',
              color: selectedPhase === 'vegetativa' ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🌱 Vegetativa
          </button>
          <button
            onClick={() => setSelectedPhase('floracao')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              background: selectedPhase === 'floracao' ? '#FF9800' : '#f5f5f5',
              color: selectedPhase === 'floracao' ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🌸 Floração
          </button>
        </div>

        <div style={{ 
          padding: '1rem', 
          background: phaseInfo.bgColor, 
          borderRadius: '8px', 
          borderLeft: `4px solid ${phaseInfo.color}`,
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: 0, color: phaseInfo.color, fontSize: '1.1rem' }}>
            {phaseInfo.title}
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            {phaseInfo.subtitle} • Nutriente especial: {phaseInfo.nutrient}
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Semana</th>
                <th>Solução Final</th>
                <th>Concentrado</th>
                <th>Água a Adicionar</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="week-number">Semana {item.semana}</span>
                  </td>
                  <td>{item.solucao_final_litros}L</td>
                  <td style={{ fontWeight: '600', color: phaseInfo.color }}>
                    {item.concentrado_litros}L
                  </td>
                  <td>{(item.solucao_final_litros - item.concentrado_litros).toFixed(1)}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">📊</span>
          <h2 className="card-title">Resumo da Fase</h2>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">📈 Total de Semanas</span>
            <span className="info-value">{currentData.length}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">💧 Total Solução Final</span>
            <span className="info-value">
              {currentData.reduce((sum, item) => sum + item.solucao_final_litros, 0).toFixed(1)}L
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🧪 Total Concentrado</span>
            <span className="info-value">
              {currentData.reduce((sum, item) => sum + item.concentrado_litros, 0).toFixed(1)}L
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">💦 Média Semanal</span>
            <span className="info-value">
              {(currentData.reduce((sum, item) => sum + item.solucao_final_litros, 0) / currentData.length).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">💡</span>
          <h2 className="card-title">Dicas para esta Fase</h2>
        </div>
        
        {selectedPhase === 'vegetativa' ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: '#E8F5E8', borderRadius: '6px' }}>
              <strong>🌱 Crescimento:</strong> Foque no desenvolvimento de folhas e caules
            </div>
            <div style={{ padding: '0.75rem', background: '#E8F5E8', borderRadius: '6px' }}>
              <strong>💡 Luz:</strong> 18-24 horas de luz por dia
            </div>
            <div style={{ padding: '0.75rem', background: '#E8F5E8', borderRadius: '6px' }}>
              <strong>🧪 Nutriente:</strong> MAP para nitrogênio e fósforo
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: '#FFF3E0', borderRadius: '6px' }}>
              <strong>🌸 Floração:</strong> Desenvolvimento de flores e resina
            </div>
            <div style={{ padding: '0.75rem', background: '#FFF3E0', borderRadius: '6px' }}>
              <strong>💡 Luz:</strong> 12 horas de luz / 12 horas de escuridão
            </div>
            <div style={{ padding: '0.75rem', background: '#FFF3E0', borderRadius: '6px' }}>
              <strong>🧪 Nutriente:</strong> MKP para potássio e fósforo
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CronogramaFertirrigacao;

