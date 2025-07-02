import React, { useState } from 'react';

const CalculadoraReceita = () => {
  const [volumeDesejado, setVolumeDesejado] = useState('');
  const [faseEscolhida, setFaseEscolhida] = useState('vegetativa');
  const [resultados, setResultados] = useState(null);

  const receitaBase = {
    volume_referencia: 20, // 20L de concentrado
    ingredientes_base: [
      { nome: "Sílica", quantidade: 60, unidade: "ml" },
      { nome: "Sulfato de magnésio", quantidade: 40, unidade: "g" },
      { nome: "Nitrato de cálcio", quantidade: 60, unidade: "g" },
      { nome: "Plant Prod", quantidade: 130, unidade: "g" },
      { nome: "Quelato de ferro + micronutrientes", quantidade: "q.s.", unidade: "" }
    ],
    nutrientes_fase: {
      vegetativa: { nome: "MAP", quantidade: 20, unidade: "g" },
      floracao: { nome: "MKP", quantidade: 40, unidade: "g" }
    }
  };

  const calcularReceita = () => {
    if (!volumeDesejado || volumeDesejado <= 0) {
      alert('Por favor, insira um volume válido maior que 0');
      return;
    }

    const volume = parseFloat(volumeDesejado);
    const fator = volume / receitaBase.volume_referencia;

    const ingredientesCalculados = receitaBase.ingredientes_base.map(ingrediente => {
      if (ingrediente.quantidade === "q.s.") {
        return {
          ...ingrediente,
          quantidade_calculada: "q.s."
        };
      }
      
      const quantidadeCalculada = (ingrediente.quantidade * fator).toFixed(2);
      return {
        ...ingrediente,
        quantidade_calculada: quantidadeCalculada
      };
    });

    const nutrienteFase = receitaBase.nutrientes_fase[faseEscolhida];
    const nutrienteCalculado = {
      ...nutrienteFase,
      quantidade_calculada: (nutrienteFase.quantidade * fator).toFixed(2)
    };

    const solucaoFinal = volume * 10; // 1L de concentrado rende 10L de solução final
    const aguaParaDiluir = solucaoFinal - volume;

    setResultados({
      volume_concentrado: volume,
      fase: faseEscolhida,
      ingredientes: ingredientesCalculados,
      nutriente_fase: nutrienteCalculado,
      solucao_final: solucaoFinal,
      agua_diluir: aguaParaDiluir,
      fator_calculo: fator
    });
  };

  const limparCalculos = () => {
    setVolumeDesejado('');
    setResultados(null);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-icon">🧮</span>
          <h2 className="card-title">Calculadora de Receita</h2>
        </div>
        
        <div className="calculator-form">
          <div className="form-group">
            <label className="form-label">
              💧 Volume de Concentrado Desejado (Litros)
            </label>
            <input
              type="number"
              className="form-input"
              value={volumeDesejado}
              onChange={(e) => setVolumeDesejado(e.target.value)}
              placeholder="Ex: 5"
              min="0.1"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              🌱 Fase do Cultivo
            </label>
            <select
              className="form-select"
              value={faseEscolhida}
              onChange={(e) => setFaseEscolhida(e.target.value)}
            >
              <option value="vegetativa">🌱 Fase Vegetativa (MAP)</option>
              <option value="floracao">🌸 Fase de Floração (MKP)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="calculate-button"
              onClick={calcularReceita}
              style={{ flex: 1 }}
            >
              🧮 Calcular Receita
            </button>
            <button
              onClick={limparCalculos}
              style={{
                padding: '1rem',
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {resultados && (
        <>
          <div className="card">
            <div className="card-header">
              <span className="card-icon">📋</span>
              <h2 className="card-title">Receita Calculada</h2>
            </div>
            
            <div className="results-section">
              <div className="results-title">
                📊 Resumo do Cálculo
              </div>
              <div className="results-list">
                <div className="result-item">
                  <span className="result-name">Volume de Concentrado</span>
                  <span className="result-amount">{resultados.volume_concentrado}L</span>
                </div>
                <div className="result-item">
                  <span className="result-name">Solução Final Total</span>
                  <span className="result-amount">{resultados.solucao_final}L</span>
                </div>
                <div className="result-item">
                  <span className="result-name">Água para Diluir</span>
                  <span className="result-amount">{resultados.agua_diluir}L</span>
                </div>
                <div className="result-item">
                  <span className="result-name">Fase Selecionada</span>
                  <span className="result-amount">
                    {resultados.fase === 'vegetativa' ? '🌱 Vegetativa' : '🌸 Floração'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">🧪</span>
              <h2 className="card-title">Ingredientes Base</h2>
            </div>
            
            <div className="recipe-list">
              {resultados.ingredientes.map((ingrediente, index) => (
                <div key={index} className="recipe-item">
                  <span className="recipe-name">{ingrediente.nome}</span>
                  <span className="recipe-amount">
                    {ingrediente.quantidade_calculada} {ingrediente.unidade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">🌱</span>
              <h2 className="card-title">Nutriente da Fase</h2>
            </div>
            
            <div style={{ 
              padding: '1rem', 
              background: resultados.fase === 'vegetativa' ? '#E8F5E8' : '#FFF3E0', 
              borderRadius: '8px', 
              borderLeft: `4px solid ${resultados.fase === 'vegetativa' ? '#4CAF50' : '#FF9800'}`
            }}>
              <div className="recipe-item" style={{ background: 'white', margin: 0 }}>
                <span className="recipe-name">{resultados.nutriente_fase.nome}</span>
                <span className="recipe-amount">
                  {resultados.nutriente_fase.quantidade_calculada} {resultados.nutriente_fase.unidade}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">📝</span>
              <h2 className="card-title">Instruções de Preparo</h2>
            </div>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
                <strong>1.</strong> Adicione todos os ingredientes base listados acima
              </div>
              <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
                <strong>2.</strong> Adicione {resultados.nutriente_fase.quantidade_calculada}{resultados.nutriente_fase.unidade} de {resultados.nutriente_fase.nome}
              </div>
              <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
                <strong>3.</strong> Complete com água até {resultados.volume_concentrado}L e misture bem
              </div>
              <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
                <strong>4.</strong> Para usar: dilua 1L de concentrado em 9L de água
              </div>
              <div style={{ padding: '0.75rem', background: '#E8F5E8', borderRadius: '6px', borderLeft: '4px solid #4CAF50' }}>
                <strong>✅ Resultado:</strong> {resultados.solucao_final}L de solução final para rega
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-icon">💡</span>
          <h2 className="card-title">Como Usar a Calculadora</h2>
        </div>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px' }}>
            <strong>📏 Volume:</strong> Insira quantos litros de concentrado você quer preparar
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px' }}>
            <strong>🌱 Fase:</strong> Escolha se suas plantas estão em vegetativa ou floração
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px' }}>
            <strong>🧮 Cálculo:</strong> A receita será ajustada proporcionalmente
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px' }}>
            <strong>💧 Diluição:</strong> Sempre dilua 1L de concentrado em 9L de água
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraReceita;

