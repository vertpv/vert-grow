import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

const MobileWizard = ({ 
  steps, 
  onComplete, 
  onCancel,
  onSkip,
  title = 'Wizard',
  showProgress = true,
  allowSkip = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se o step atual é válido
  useEffect(() => {
    const currentStepConfig = steps[currentStep];
    if (currentStepConfig.validate) {
      setIsValid(currentStepConfig.validate(stepData));
    } else {
      setIsValid(true);
    }
  }, [currentStep, stepData, steps]);

  const updateStepData = (field, value) => {
    setStepData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Último step - completar wizard
      setIsLoading(true);
      try {
        await onComplete(stepData);
      } catch (error) {
        console.error('Erro ao completar wizard:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={`mobile-wizard ${className}`}>
      {/* Header */}
      <div className="wizard-header">
        <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                className="btn btn-ghost p-2"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            )}
            <div>
              <h1 className="font-bold text-lg">{title}</h1>
              {currentStepConfig.subtitle && (
                <p className="text-sm text-muted-foreground">
                  {currentStepConfig.subtitle}
                </p>
              )}
            </div>
          </div>
          
          {allowSkip && (
            <button
              className="btn btn-ghost text-sm"
              onClick={() => onSkip()}
              disabled={isLoading}
            >
              Pular
            </button>
          )}
        </div>

        {/* Progress */}
        {showProgress && (
          <div className="px-4 py-3 bg-background border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {currentStepConfig.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} de {steps.length}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-between mt-3">
              {steps.map((step, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    index < currentStep
                      ? 'bg-success text-white'
                      : index === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep || isLoading}
                >
                  {index < currentStep ? (
                    <Check size={14} />
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="wizard-content flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          <StepComponent
            data={stepData}
            updateData={updateStepData}
            isValid={isValid}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="wizard-navigation fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="flex gap-3">
          {!isFirstStep && (
            <button
              className="btn btn-outline flex-1"
              onClick={prevStep}
              disabled={isLoading}
            >
              <ChevronLeft size={16} />
              Voltar
            </button>
          )}
          
          <button
            className={`btn flex-1 ${isLastStep ? 'btn-success' : 'btn-primary'}`}
            onClick={nextStep}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </div>
            ) : (
              <>
                {isLastStep ? 'Finalizar' : 'Continuar'}
                {!isLastStep && <ChevronRight size={16} />}
                {isLastStep && <Check size={16} />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook para usar wizard
export const useWizard = (initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setData(initialData);
    setCurrentStep(0);
  };

  return {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    reset
  };
};

// Componente de step genérico
export const WizardStep = ({ 
  title, 
  description, 
  children, 
  className = '' 
}) => (
  <div className={`wizard-step ${className}`}>
    {title && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
    )}
    {children}
  </div>
);

// Componente de campo de formulário otimizado para mobile
export const WizardField = ({ 
  label, 
  description, 
  error, 
  required = false,
  children,
  className = ''
}) => (
  <div className={`wizard-field mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    {children}
    {description && (
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    )}
    {error && (
      <p className="text-xs text-destructive mt-1">{error}</p>
    )}
  </div>
);

// Componente de seleção múltipla otimizado para mobile
export const WizardMultiSelect = ({ 
  options, 
  value = [], 
  onChange, 
  maxSelections,
  className = ''
}) => {
  const toggleOption = (optionId) => {
    if (value.includes(optionId)) {
      onChange(value.filter(id => id !== optionId));
    } else {
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, optionId]);
      }
    }
  };

  return (
    <div className={`wizard-multi-select space-y-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            value.includes(option.id)
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => toggleOption(option.id)}
          disabled={
            !value.includes(option.id) && 
            maxSelections && 
            value.length >= maxSelections
          }
        >
          <div className="flex items-center gap-3">
            {option.icon && (
              <span className="text-2xl">{option.icon}</span>
            )}
            <div className="flex-1">
              <div className="font-medium">{option.title}</div>
              {option.description && (
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              )}
            </div>
            {value.includes(option.id) && (
              <Check size={20} color="var(--primary)" />
            )}
          </div>
        </button>
      ))}
      
      {maxSelections && (
        <p className="text-xs text-muted-foreground text-center">
          {value.length} de {maxSelections} selecionados
        </p>
      )}
    </div>
  );
};

// Componente de seleção única otimizado para mobile
export const WizardSingleSelect = ({ 
  options, 
  value, 
  onChange, 
  className = '',
  layout = 'list' // 'list' ou 'grid'
}) => (
  <div className={`wizard-single-select ${
    layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'
  } ${className}`}>
    {options.map((option) => (
      <button
        key={option.id}
        className={`p-4 rounded-lg border-2 transition-all ${
          layout === 'grid' ? 'text-center' : 'text-left w-full'
        } ${
          value === option.id
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => onChange(option.id)}
      >
        <div className={`flex items-center gap-3 ${
          layout === 'grid' ? 'flex-col' : ''
        }`}>
          {option.icon && (
            <span className="text-2xl">{option.icon}</span>
          )}
          <div className={layout === 'grid' ? 'text-center' : 'flex-1'}>
            <div className="font-medium">{option.title}</div>
            {option.description && (
              <div className="text-sm text-muted-foreground">
                {option.description}
              </div>
            )}
          </div>
          {value === option.id && layout === 'list' && (
            <Check size={20} color="var(--primary)" />
          )}
        </div>
      </button>
    ))}
  </div>
);

export default MobileWizard;

