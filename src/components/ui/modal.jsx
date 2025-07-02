import React from 'react';
import { X, Check, ArrowLeft, ArrowRight } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon,
  children, 
  footer,
  size = 'md',
  showProgress = false,
  currentStep = 1,
  totalSteps = 1,
  stepLabel = '',
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`card ${sizeClasses[size]} ${className}`}
        style={{
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {Icon && <Icon size={20} />}
              <h2 className="font-semibold">{title}</h2>
            </div>
            <button className="btn btn-ghost" onClick={onClose} style={{ padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
          
          {/* Progress Indicator */}
          {showProgress && totalSteps > 1 && (
            <>
              <div className="flex items-center gap-2 mt-4">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map(stepNum => (
                  <div key={stepNum} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stepNum <= currentStep ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {stepNum < currentStep ? <Check size={16} /> : stepNum}
                    </div>
                    {stepNum < totalSteps && (
                      <div 
                        className={`w-12 h-1 mx-2 ${
                          stepNum < currentStep ? 'bg-primary' : 'bg-secondary'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {stepLabel && (
                <div className="text-sm text-muted-foreground mt-2">
                  {stepLabel}
                </div>
              )}
            </>
          )}
        </div>

        <div className="card-content">
          {children}
        </div>

        {footer && (
          <div className="card-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const ModalFooter = ({ 
  onCancel, 
  onNext, 
  onPrevious, 
  onConfirm,
  cancelText = 'Cancelar',
  nextText = 'Próximo',
  previousText = 'Voltar',
  confirmText = 'Confirmar',
  loading = false,
  isFirstStep = false,
  isLastStep = false,
  canProceed = true
}) => {
  return (
    <div className="flex justify-between">
      <button 
        className="btn btn-outline"
        onClick={isFirstStep ? onCancel : onPrevious}
        disabled={loading}
      >
        <ArrowLeft size={16} />
        {isFirstStep ? cancelText : previousText}
      </button>
      
      {!isLastStep ? (
        <button 
          className="btn btn-primary"
          onClick={onNext}
          disabled={loading || !canProceed}
        >
          {nextText}
          <ArrowRight size={16} />
        </button>
      ) : (
        <button 
          className="btn btn-primary"
          onClick={onConfirm}
          disabled={loading || !canProceed}
        >
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
              Salvando...
            </>
          ) : (
            <>
              <Check size={16} />
              {confirmText}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export { Modal, ModalFooter };
export default Modal;

