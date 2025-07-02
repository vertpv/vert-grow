import React, { useState } from 'react';

const Onboarding = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bem-vindo ao Cultivo Manager! 🌿",
      content: (
        <div className="onboarding-step">
          <div className="welcome-icon">🎉</div>
          <h2>Olá, {user.username}!</h2>
          <p>Parabéns por se juntar ao Cultivo Manager! Vamos te ajudar a configurar tudo para gerenciar seu cultivo indoor de forma profissional.</p>
          <div className="features-preview">
            <div className="feature-item">
              <span className="feature-icon">🌱</span>
              <span>Gerenciar plantas individualmente</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏠</span>
              <span>Configurar tendas de cultivo</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌡️</span>
              <span>Monitorar ambiente</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Dashboard e relatórios</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Gerenciamento de Plantas 🌱",
      content: (
        <div className="onboarding-step">
          <div className="step-icon">🌱</div>
          <h2>Suas Plantas, Seu Controle</h2>
          <p>Com o Cultivo Manager, você pode:</p>
          <ul className="feature-list">
            <li>📝 Cadastrar cada planta com strain, origem e data de plantio</li>
            <li>📅 Fazer check-ins diários com tarefas e observações</li>
            <li>📈 Acompanhar o crescimento e desenvolvimento</li>
            <li>🔄 Gerenciar as fases: Germinação → Vegetativa → Floração</li>
            <li>🏠 Mover plantas entre diferentes tendas</li>
          </ul>
          <div className="tip-box">
            <strong>💡 Dica:</strong> Comece adicionando suas plantas na aba "🌱 Plantas" e faça check-ins diários para melhores resultados!
          </div>
        </div>
      )
    },
    {
      title: "Tendas de Cultivo 🏠",
      content: (
        <div className="onboarding-step">
          <div className="step-icon">🏠</div>
          <h2>Configure Suas Tendas</h2>
          <p>Gerencie suas tendas com precisão científica:</p>
          <ul className="feature-list">
            <li>📏 Dimensões predefinidas (40x40 até 150x150 cm)</li>
            <li>💡 Setup de luz com cálculo automático de PPFD</li>
            <li>🔧 Modelos de LED (LM301h, LM281b, etc.)</li>
            <li>📊 Limite de plantas por tenda baseado na área</li>
            <li>🎯 Recomendações baseadas no PPFD calculado</li>
          </ul>
          <div className="tip-box">
            <strong>💡 Dica:</strong> Configure suas tendas na aba "🏠 Tendas" para calcular automaticamente o PPFD ideal!
          </div>
        </div>
      )
    },
    {
      title: "Monitoramento Ambiental 🌡️",
      content: (
        <div className="onboarding-step">
          <div className="step-icon">🌡️</div>
          <h2>Controle Total do Ambiente</h2>
          <p>Mantenha as condições ideais:</p>
          <ul className="feature-list">
            <li>🌡️ Registre temperatura semanalmente</li>
            <li>💧 Monitore umidade relativa</li>
            <li>📊 Veja médias automáticas e status visual</li>
            <li>📝 Adicione observações sobre condições especiais</li>
            <li>💡 Receba dicas de controle ambiental</li>
          </ul>
          <div className="ranges-info">
            <div className="range-item">
              <strong>🌡️ Temperatura ideal:</strong> 20-28°C (dia), 18-24°C (noite)
            </div>
            <div className="range-item">
              <strong>💧 Umidade ideal:</strong> 40-60% (vegetativa), 40-50% (floração)
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard e Relatórios 📊",
      content: (
        <div className="onboarding-step">
          <div className="step-icon">📊</div>
          <h2>Visão Geral do Seu Cultivo</h2>
          <p>Acompanhe tudo em um só lugar:</p>
          <ul className="feature-list">
            <li>📈 Estatísticas gerais (total de plantas, tendas)</li>
            <li>🌱 Distribuição de plantas por fase</li>
            <li>📅 Check-ins recentes</li>
            <li>🌡️ Últimos registros ambientais</li>
            <li>📄 Exportação de relatórios</li>
          </ul>
          <div className="tip-box">
            <strong>💡 Dica:</strong> Use o dashboard para ter uma visão geral rápida do seu cultivo!
          </div>
        </div>
      )
    },
    {
      title: "Pronto para Começar! 🚀",
      content: (
        <div className="onboarding-step">
          <div className="step-icon">🚀</div>
          <h2>Você está pronto!</h2>
          <p>Agora você conhece todas as funcionalidades do Cultivo Manager. Vamos começar?</p>
          
          <div className="next-steps">
            <h3>Próximos passos recomendados:</h3>
            <ol className="steps-list">
              <li>🏠 Configure suas tendas de cultivo</li>
              <li>🌱 Adicione suas plantas com data de germinação</li>
              <li>🌡️ Registre as condições ambientais atuais</li>
              <li>📅 Comece a fazer check-ins diários</li>
              <li>📊 Acompanhe o progresso no dashboard</li>
            </ol>
          </div>

          <div className="success-message">
            <strong>🎉 Bem-vindo ao futuro do cultivo indoor!</strong>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="step-counter">
            {currentStep + 1} de {steps.length}
          </div>
        </div>

        <div className="onboarding-content">
          <h1>{steps[currentStep].title}</h1>
          {steps[currentStep].content}
        </div>

        <div className="onboarding-footer">
          <div className="button-group">
            {currentStep > 0 && (
              <button onClick={prevStep} className="btn-secondary">
                ← Anterior
              </button>
            )}
            
            <button onClick={skipOnboarding} className="btn-skip">
              Pular tutorial
            </button>
            
            <button onClick={nextStep} className="btn-primary">
              {currentStep === steps.length - 1 ? 'Começar!' : 'Próximo →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

