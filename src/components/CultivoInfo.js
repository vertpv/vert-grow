import React from 'react';

const CultivoInfo = () => {
  const cultivoData = {
    local: "Apartamento em Parnamirim, RN",
    temperatura_sem_ar: "32 ºC",
    umidade_media: "55%",
    controle_climatico: "Ar-condicionado",
    substrato: "Vasos com 10L cada (solo reutilizado + revitalizado)",
    rega: "Automática, com solução concentrada diluída",
    numero_plantas: 12,
    strains: [
      { nome: "Banana Blaze", quantidade: 4, origem: "Dutch Passion" },
      { nome: "Mighty Grape", quantidade: 3, origem: "Freedom of Seeds" },
      { nome: "CBD Pink Black", quantidade: 3, origem: "Automática – Dentista Seeds" },
      { nome: "Gorilla Glue", quantidade: 2, origem: "" }
    ]
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-icon">🏠</span>
          <h2 className="card-title">Dados do Cultivo</h2>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">📍 Local</span>
            <span className="info-value">{cultivoData.local}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🌡️ Temperatura</span>
            <span className="info-value">{cultivoData.temperatura_sem_ar}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">💧 Umidade</span>
            <span className="info-value">{cultivoData.umidade_media}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">❄️ Controle Climático</span>
            <span className="info-value">{cultivoData.controle_climatico}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🪴 Substrato</span>
            <span className="info-value">{cultivoData.substrato}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">💦 Sistema de Rega</span>
            <span className="info-value">{cultivoData.rega}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🌱 Total de Plantas</span>
            <span className="info-value">{cultivoData.numero_plantas}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">🧬</span>
          <h2 className="card-title">Strains do Cultivo</h2>
        </div>
        
        <div className="strains-list">
          {cultivoData.strains.map((strain, index) => (
            <div key={index} className="strain-item">
              <div>
                <div className="strain-name">{strain.nome}</div>
                {strain.origem && (
                  <div className="strain-details">{strain.origem}</div>
                )}
              </div>
              <div className="strain-details">
                <strong>{strain.quantidade}x</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-icon">💡</span>
          <h2 className="card-title">Dicas Importantes</h2>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">🛡️ Pulverização Preventiva</span>
            <span className="info-value">Semanal</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">📅 Segunda-feira</span>
            <span className="info-value">Óleo de neem</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">📅 Sexta-feira</span>
            <span className="info-value">Chá de alho</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🔬 Controle EC/pH</span>
            <span className="info-value">Medição semanal</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🪤 Controle de Pragas</span>
            <span className="info-value">Armadilhas amarelas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultivoInfo;

