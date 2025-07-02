import React from 'react';

const ReceitaConcentrada = () => {
  const receitaData = {
    volume_balde_litros: 20,
    rende_litros: 200,
    proporcao_diluicao: "1L para 10L de água",
    ingredientes_base: [
      { nome: "Sílica", quantidade: 60, unidade: "ml" },
      { nome: "Sulfato de magnésio", quantidade: 40, unidade: "g" },
      { nome: "Nitrato de cálcio", quantidade: 60, unidade: "g" },
      { nome: "Plant Prod", quantidade: 130, unidade: "g" },
      { nome: "Quelato de ferro + micronutrientes", quantidade: "q.s.", unidade: "" }
    ],
    nutrientes_fase: {
      vegetativa: { nome: "MAP", quantidade: 20, unidade: "g", por_volume_concentrado: "20L" },
      floracao: { nome: "MKP", quantidade: 40, unidade: "g", por_volume_concentrado: "20L" }
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-icon">🧪</span>
          <h2 className="card-title">Receita Concentrada Base</h2>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">🪣 Volume do Balde</span>
            <span className="info-value">{receitaData.volume_balde_litros}L</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">💧 Rendimento Total</span>
            <span className="info-value">{receitaData.rende_litros}L</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">⚖️ Proporção de Diluição</span>
            <span className="info-value">{receitaData.proporcao_diluicao}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">🧬</span>
          <h2 className="card-title">Ingredientes Base</h2>
        </div>
        
        <div className="recipe-list">
          {receitaData.ingredientes_base.map((ingrediente, index) => (
            <div key={index} className="recipe-item">
              <span className="recipe-name">{ingrediente.nome}</span>
              <span className="recipe-amount">
                {ingrediente.quantidade} {ingrediente.unidade}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">🌱</span>
          <h2 className="card-title">Nutrientes por Fase</h2>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#E8F5E8', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="phase-badge phase-vegetativa">Fase Vegetativa</span>
            </div>
            <div className="recipe-item" style={{ background: 'white', margin: 0 }}>
              <span className="recipe-name">{receitaData.nutrientes_fase.vegetativa.nome}</span>
              <span className="recipe-amount">
                {receitaData.nutrientes_fase.vegetativa.quantidade} {receitaData.nutrientes_fase.vegetativa.unidade}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
              Por {receitaData.nutrientes_fase.vegetativa.por_volume_concentrado} de concentrado
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#FFF3E0', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="phase-badge phase-floracao">Fase de Floração</span>
            </div>
            <div className="recipe-item" style={{ background: 'white', margin: 0 }}>
              <span className="recipe-name">{receitaData.nutrientes_fase.floracao.nome}</span>
              <span className="recipe-amount">
                {receitaData.nutrientes_fase.floracao.quantidade} {receitaData.nutrientes_fase.floracao.unidade}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
              Por {receitaData.nutrientes_fase.floracao.por_volume_concentrado} de concentrado
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">📋</span>
          <h2 className="card-title">Instruções de Preparo</h2>
        </div>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
            <strong>1.</strong> Adicione todos os ingredientes base no balde de {receitaData.volume_balde_litros}L
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
            <strong>2.</strong> Adicione o nutriente específico da fase (MAP ou MKP)
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
            <strong>3.</strong> Complete com água até {receitaData.volume_balde_litros}L e misture bem
          </div>
          <div style={{ padding: '0.75rem', background: '#f8f8f8', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
            <strong>4.</strong> Para usar: dilua {receitaData.proporcao_diluicao}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceitaConcentrada;

