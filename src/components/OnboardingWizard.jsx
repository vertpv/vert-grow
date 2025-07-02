import React from 'react';
import MobileWizard, { 
  WizardStep, 
  WizardField, 
  WizardSingleSelect, 
  WizardMultiSelect 
} from './MobileWizard';
import { 
  User, 
  Home, 
  Lightbulb, 
  Target,
  CheckCircle,
  Sprout
} from 'lucide-react';

const OnboardingWizard = ({ user, onComplete, onSkip, onLogout }) => {
  const steps = [
    {
      title: 'Bem-vindo!',
      subtitle: 'Vamos configurar seu perfil',
      component: WelcomeStep,
      validate: () => true
    },
    {
      title: 'Informações Pessoais',
      subtitle: 'Como podemos te chamar?',
      component: PersonalStep,
      validate: (data) => {
        // O nome é obrigatório apenas se o usuário não tiver um nome completo no metadata
        if (!user?.user_metadata?.full_name) {
          return data.name && data.name.trim().length > 0;
        }
        return true;
      }
    },
    {
      title: 'Sua Experiência',
      subtitle: 'Qual seu nível?',
      component: ExperienceStep,
      validate: (data) => data.experience && data.experience.length > 0
    },
    {
      title: 'Setup do Grow',
      subtitle: 'Conte sobre seu espaço',
      component: SetupStep,
      validate: (data) => data.growType && data.spaceSize
    },
    {
      title: 'Equipamentos',
      subtitle: 'Que equipamentos você tem?',
      component: EquipmentStep,
      validate: (data) => data.lighting
    },
    {
      title: 'Seus Objetivos',
      subtitle: 'O que você quer cultivar?',
      component: GoalsStep,
      validate: (data) => data.goals && data.goals.length > 0
    },
    {
      title: 'Finalizar',
      subtitle: 'Tudo pronto!',
      component: CompleteStep,
      validate: () => true
    }
  ];

  const handleComplete = async (data) => {
    try {
      // Salvar dados do usuário
      localStorage.setItem('vert-grow-onboarding', JSON.stringify(data));
      localStorage.setItem('vert-grow-onboarding-completed', 'true');
      
      // Chamar callback de conclusão
      onComplete(data);
    } catch (error) {
      console.error('Erro ao salvar dados do onboarding:', error);
      throw error;
    }
  };

  return (
    <MobileWizard
      title="VERT GROW Setup"
      steps={steps}
      onComplete={handleComplete}
      showProgress={true}
      className="min-h-screen"
      onCancel={onLogout} // Usar onCancel para o botão de logout
    />
  );
};

// Step Components
const WelcomeStep = () => (
  <WizardStep>
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <Sprout size={48} color="white" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Bem-vindo ao VERT GROW!</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Vamos configurar seu perfil de cultivo para personalizar sua experiência e 
        fornecer recomendações específicas para seu setup.
      </p>
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
          <User size={20} color="var(--primary)" />
          <span>Informações pessoais e experiência</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
          <Home size={20} color="var(--primary)" />
          <span>Setup e equipamentos do seu grow</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
          <Target size={20} color="var(--primary)" />
          <span>Objetivos e preferências de cultivo</span>
        </div>
      </div>
    </div>
  </WizardStep>
);

const PersonalStep = ({ data, updateData }) => (
  <WizardStep
    title="Como podemos te chamar?"
    description="Este nome aparecerá no seu perfil e nas saudações"
  >
    <WizardField
      label="Nome ou apelido"
      required
    >
      <input
        type="text"
        className="input w-full"
        placeholder="Digite seu nome"
        value={data.name || ''}
        onChange={(e) => updateData('name', e.target.value)}
        autoFocus
      />
    </WizardField>
  </WizardStep>
);

const ExperienceStep = ({ data, updateData }) => {
  const experiences = [
    {
      id: 'beginner',
      title: 'Iniciante',
      description: 'Primeira vez cultivando',
      icon: '🌱'
    },
    {
      id: 'intermediate',
      title: 'Intermediário',
      description: 'Alguns cultivos realizados',
      icon: '🌿'
    },
    {
      id: 'advanced',
      title: 'Avançado',
      description: 'Muita experiência',
      icon: '🌳'
    },
    {
      id: 'expert',
      title: 'Especialista',
      description: 'Profissional ou muito experiente',
      icon: '🏆'
    }
  ];

  return (
    <WizardStep
      title="Qual seu nível de experiência?"
      description="Isso nos ajuda a personalizar as recomendações"
    >
      <WizardSingleSelect
        options={experiences}
        value={data.experience}
        onChange={(value) => updateData('experience', value)}
      />
    </WizardStep>
  );
};

const SetupStep = ({ data, updateData }) => {
  const growTypes = [
    { id: 'indoor', title: 'Indoor', description: 'Ambiente fechado', icon: '🏠' },
    { id: 'outdoor', title: 'Outdoor', description: 'Ao ar livre', icon: '🌞' },
    { id: 'greenhouse', title: 'Estufa', description: 'Cultivo em estufa', icon: '🏡' },
    { id: 'hybrid', title: 'Híbrido', description: 'Combinação', icon: '🔄' }
  ];

  const spaceSizes = [
    { id: 'small', title: 'Pequeno', description: 'Até 1m²', icon: '📦' },
    { id: 'medium', title: 'Médio', description: '1-4m²', icon: '📋' },
    { id: 'large', title: 'Grande', description: '4-10m²', icon: '🏢' },
    { id: 'commercial', title: 'Comercial', description: 'Mais de 10m²', icon: '🏭' }
  ];

  return (
    <WizardStep
      title="Conte sobre seu setup"
      description="Informações sobre seu espaço de cultivo"
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Tipo de cultivo</h3>
          <WizardSingleSelect
            options={growTypes}
            value={data.growType}
            onChange={(value) => updateData('growType', value)}
            layout="grid"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Tamanho do espaço</h3>
          <WizardSingleSelect
            options={spaceSizes}
            value={data.spaceSize}
            onChange={(value) => updateData('spaceSize', value)}
          />
        </div>
      </div>
    </WizardStep>
  );
};

const EquipmentStep = ({ data, updateData }) => {
  const lightingOptions = [
    { id: 'led', title: 'LED', description: 'Painéis LED full spectrum', icon: '💡' },
    { id: 'hps', title: 'HPS', description: 'Lâmpadas de sódio', icon: '🔥' },
    { id: 'cfl', title: 'CFL', description: 'Lâmpadas fluorescentes', icon: '💡' },
    { id: 'natural', title: 'Natural', description: 'Luz solar', icon: '☀️' },
    { id: 'none', title: 'Ainda não tenho', description: 'Vou comprar', icon: '❓' }
  ];

  const ventilationOptions = [
    { id: 'complete', title: 'Sistema completo', description: 'Exaustor + intrator + filtro', icon: '🌪️' },
    { id: 'basic', title: 'Sistema básico', description: 'Apenas exaustor', icon: '💨' },
    { id: 'passive', title: 'Ventilação passiva', description: 'Sem equipamentos', icon: '🍃' },
    { id: 'none', title: 'Ainda não tenho', description: 'Vou instalar', icon: '❓' }
  ];

  return (
    <WizardStep
      title="Que equipamentos você tem?"
      description="Informações sobre sua iluminação e ventilação"
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Iluminação</h3>
          <WizardSingleSelect
            options={lightingOptions}
            value={data.lighting}
            onChange={(value) => updateData('lighting', value)}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Ventilação</h3>
          <WizardSingleSelect
            options={ventilationOptions}
            value={data.ventilation}
            onChange={(value) => updateData('ventilation', value)}
          />
        </div>
      </div>
    </WizardStep>
  );
};

const GoalsStep = ({ data, updateData }) => {
  const goals = [
    { id: 'personal', title: 'Uso pessoal', description: 'Consumo próprio', icon: '👤' },
    { id: 'medical', title: 'Uso medicinal', description: 'Fins terapêuticos', icon: '🏥' },
    { id: 'hobby', title: 'Hobby', description: 'Diversão e aprendizado', icon: '🎯' },
    { id: 'commercial', title: 'Comercial', description: 'Fins comerciais', icon: '💼' },
    { id: 'research', title: 'Pesquisa', description: 'Estudos e experimentos', icon: '🔬' }
  ];

  return (
    <WizardStep
      title="Quais são seus objetivos?"
      description="Selecione todos que se aplicam (múltipla escolha)"
    >
      <WizardMultiSelect
        options={goals}
        value={data.goals || []}
        onChange={(value) => updateData('goals', value)}
      />
    </WizardStep>
  );
};

const CompleteStep = ({ data }) => (
  <WizardStep>
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} color="white" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Tudo Pronto, {data.name}!</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Seu perfil foi configurado com sucesso. Agora você terá uma experiência 
        personalizada baseada no seu setup e objetivos.
      </p>
      
      <div className="space-y-4 text-left mb-8">
        <div className="p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold mb-2">O que você pode fazer agora:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} color="var(--success)" />
              Configurar suas primeiras tendas
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} color="var(--success)" />
              Adicionar suas plantas
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} color="var(--success)" />
              Começar o monitoramento ambiental
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} color="var(--success)" />
              Receber recomendações personalizadas
            </li>
          </ul>
        </div>
      </div>
    </div>
  </WizardStep>
);

export default OnboardingWizard;

