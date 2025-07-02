// Sistema de Internacionalização para VERT GROW

const translations = {
  'pt-BR': {
    // Geral
    'app.name': 'VERT GROW',
    'app.tagline': 'Sistema de Gestão de Cultivo',
    'loading': 'Carregando...',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'add': 'Adicionar',
    'close': 'Fechar',
    'confirm': 'Confirmar',
    'yes': 'Sim',
    'no': 'Não',
    'back': 'Voltar',
    'next': 'Próximo',
    'previous': 'Anterior',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'export': 'Exportar',
    'import': 'Importar',
    'copy': 'Copiar',
    'download': 'Baixar',
    
    // Autenticação
    'auth.login': 'Entrar',
    'auth.register': 'Registrar',
    'auth.logout': 'Sair',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.name': 'Nome',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.forgotPassword': 'Esqueci minha senha',
    'auth.loginTitle': 'Acesse sua conta',
    'auth.registerTitle': 'Criar nova conta',
    'auth.welcomeBack': 'Bem-vindo de volta!',
    'auth.newUser': 'Novo usuário?',
    'auth.existingUser': 'Já tem conta?',
    'auth.loginHere': 'Entre aqui',
    'auth.registerHere': 'Registre-se aqui',
    
    // Menu/Navegação
    'nav.dashboard': 'Dashboard',
    'nav.plants': 'Plantas',
    'nav.tents': 'Tendas',
    'nav.environment': 'Ambiente',
    'nav.reports': 'Relatórios',
    'nav.tools': 'Ferramentas',
    'nav.nutrition': 'Nutrição Mineral',
    'nav.info': 'Informações',
    'nav.recipe': 'Receita Concentrada',
    'nav.schedule': 'Cronograma',
    'nav.calculator': 'Calculadora',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configurações',
    'nav.more': 'Mais',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Bem-vindo de volta!',
    'dashboard.totalPlants': 'Total de Plantas',
    'dashboard.activeTents': 'Tendas Ativas',
    'dashboard.checkins': 'Check-ins',
    'dashboard.lastCheckin': 'Último',
    'dashboard.noneYet': 'Nenhum ainda',
    'dashboard.allHealthy': 'Todas saudáveis',
    'dashboard.needAttention': 'precisam atenção',
    'dashboard.configured': 'Configuradas',
    'dashboard.noneConfigured': 'Nenhuma configurada',
    'dashboard.readyToStart': 'Pronto para começar seu cultivo?',
    'dashboard.plantsInCultivation': 'plantas em cultivo',
    'dashboard.phaseDistribution': 'Distribuição por Fase',
    'dashboard.suggestedTasks': 'Tarefas Sugeridas',
    'dashboard.allUpToDate': 'Tudo em dia!',
    'dashboard.quickActions': 'Ações Rápidas',
    'dashboard.newPlant': 'Nova Planta',
    'dashboard.addToCultivation': 'Adicionar ao cultivo',
    'dashboard.monitor': 'Monitorar',
    'dashboard.environment': 'Ambiente',
    
    // Fases
    'phase.germination': 'Germinação',
    'phase.vegetative': 'Vegetativa',
    'phase.flowering': 'Floração',
    
    // Plantas
    'plants.title': 'Gerenciamento de Plantas',
    'plants.addNew': 'Adicionar Nova Planta',
    'plants.strain': 'Strain',
    'plants.phase': 'Fase',
    'plants.tent': 'Tenda',
    'plants.plantingDate': 'Data de Plantio',
    'plants.germinationDate': 'Data de Germinação',
    'plants.lastCheckin': 'Último Check-in',
    'plants.checkin': 'Check-in',
    'plants.batchCheckin': 'Check-in em Lote',
    'plants.move': 'Mover',
    'plants.health': 'Saúde',
    'plants.notes': 'Observações',
    
    // Tendas
    'tents.title': 'Tendas de Cultivo',
    'tents.addNew': 'Adicionar Nova Tenda',
    'tents.name': 'Nome',
    'tents.dimensions': 'Dimensões',
    'tents.lighting': 'Iluminação',
    'tents.capacity': 'Capacidade',
    'tents.plants': 'plantas',
    
    // Ambiente
    'environment.title': 'Monitoramento Ambiental',
    'environment.temperature': 'Temperatura',
    'environment.humidity': 'Umidade',
    'environment.ph': 'pH',
    'environment.ec': 'EC',
    'environment.addRecord': 'Adicionar Registro',
    'environment.filterByTent': 'Filtrar por Tenda',
    'environment.allTents': 'Todas as Tendas',
    
    // Relatórios
    'reports.title': 'Relatórios',
    'reports.plantHealth': 'Saúde das Plantas',
    'reports.environmentalData': 'Dados Ambientais',
    'reports.growthProgress': 'Progresso de Crescimento',
    'reports.exportData': 'Exportar Dados',
    
    // Nutrição
    'nutrition.title': 'Nutrição Mineral',
    'nutrition.concentratedRecipe': 'Receita Concentrada',
    'nutrition.cultivationPhases': 'Fases do Cultivo',
    'nutrition.calculator': 'Calculadora',
    'nutrition.dilutionCalculator': 'Calculadora de Diluição',
    'nutrition.waterVolume': 'Volume de água (ml)',
    'nutrition.desiredConcentration': 'Concentração desejada (%)',
    'nutrition.calculateDilution': 'Calcular Diluição',
    'nutrition.concentratedSolution': 'Solução concentrada',
    'nutrition.additionalWater': 'Água adicional',
    'nutrition.totalVolume': 'Volume total',
    'nutrition.estimatedEC': 'EC estimado',
    'nutrition.recommendedPH': 'pH recomendado',
    'nutrition.calculationSuccess': 'Cálculo realizado com sucesso!',
    
    // Perfil
    'profile.title': 'Perfil do Usuário',
    'profile.personalInfo': 'Informações Pessoais',
    'profile.language': 'Idioma',
    'profile.preferences': 'Preferências',
    'profile.updateProfile': 'Atualizar Perfil',
    'profile.profileUpdated': 'Perfil atualizado com sucesso!',
    
    // Mensagens de erro/sucesso
    'error.generic': 'Ocorreu um erro. Tente novamente.',
    'error.network': 'Erro de conexão. Verifique sua internet.',
    'error.validation': 'Por favor, verifique os dados informados.',
    'success.saved': 'Salvo com sucesso!',
    'success.deleted': 'Excluído com sucesso!',
    'success.updated': 'Atualizado com sucesso!',
    
    // Data/Hora
    'date.today': 'Hoje',
    'date.yesterday': 'Ontem',
    'date.daysAgo': 'dias atrás',
    'time.now': 'Agora',
    'time.minutesAgo': 'minutos atrás',
    'time.hoursAgo': 'horas atrás'
  },
  
  'en-US': {
    // General
    'app.name': 'VERT GROW',
    'app.tagline': 'Cultivation Management System',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'add': 'Add',
    'close': 'Close',
    'confirm': 'Confirm',
    'yes': 'Yes',
    'no': 'No',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'import': 'Import',
    'copy': 'Copy',
    'download': 'Download',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password',
    'auth.loginTitle': 'Access your account',
    'auth.registerTitle': 'Create new account',
    'auth.welcomeBack': 'Welcome back!',
    'auth.newUser': 'New user?',
    'auth.existingUser': 'Already have an account?',
    'auth.loginHere': 'Login here',
    'auth.registerHere': 'Register here',
    
    // Menu/Navigation
    'nav.dashboard': 'Dashboard',
    'nav.plants': 'Plants',
    'nav.tents': 'Tents',
    'nav.environment': 'Environment',
    'nav.reports': 'Reports',
    'nav.tools': 'Tools',
    'nav.nutrition': 'Mineral Nutrition',
    'nav.info': 'Information',
    'nav.recipe': 'Concentrated Recipe',
    'nav.schedule': 'Schedule',
    'nav.calculator': 'Calculator',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.more': 'More',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back!',
    'dashboard.totalPlants': 'Total Plants',
    'dashboard.activeTents': 'Active Tents',
    'dashboard.checkins': 'Check-ins',
    'dashboard.lastCheckin': 'Last',
    'dashboard.noneYet': 'None yet',
    'dashboard.allHealthy': 'All healthy',
    'dashboard.needAttention': 'need attention',
    'dashboard.configured': 'Configured',
    'dashboard.noneConfigured': 'None configured',
    'dashboard.readyToStart': 'Ready to start your cultivation?',
    'dashboard.plantsInCultivation': 'plants in cultivation',
    'dashboard.phaseDistribution': 'Phase Distribution',
    'dashboard.suggestedTasks': 'Suggested Tasks',
    'dashboard.allUpToDate': 'All up to date!',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.newPlant': 'New Plant',
    'dashboard.addToCultivation': 'Add to cultivation',
    'dashboard.monitor': 'Monitor',
    'dashboard.environment': 'Environment',
    
    // Phases
    'phase.germination': 'Germination',
    'phase.vegetative': 'Vegetative',
    'phase.flowering': 'Flowering',
    
    // Plants
    'plants.title': 'Plant Management',
    'plants.addNew': 'Add New Plant',
    'plants.strain': 'Strain',
    'plants.phase': 'Phase',
    'plants.tent': 'Tent',
    'plants.plantingDate': 'Planting Date',
    'plants.germinationDate': 'Germination Date',
    'plants.lastCheckin': 'Last Check-in',
    'plants.checkin': 'Check-in',
    'plants.batchCheckin': 'Batch Check-in',
    'plants.move': 'Move',
    'plants.health': 'Health',
    'plants.notes': 'Notes',
    
    // Tents
    'tents.title': 'Cultivation Tents',
    'tents.addNew': 'Add New Tent',
    'tents.name': 'Name',
    'tents.dimensions': 'Dimensions',
    'tents.lighting': 'Lighting',
    'tents.capacity': 'Capacity',
    'tents.plants': 'plants',
    
    // Environment
    'environment.title': 'Environmental Monitoring',
    'environment.temperature': 'Temperature',
    'environment.humidity': 'Humidity',
    'environment.ph': 'pH',
    'environment.ec': 'EC',
    'environment.addRecord': 'Add Record',
    'environment.filterByTent': 'Filter by Tent',
    'environment.allTents': 'All Tents',
    
    // Reports
    'reports.title': 'Reports',
    'reports.plantHealth': 'Plant Health',
    'reports.environmentalData': 'Environmental Data',
    'reports.growthProgress': 'Growth Progress',
    'reports.exportData': 'Export Data',
    
    // Nutrition
    'nutrition.title': 'Mineral Nutrition',
    'nutrition.concentratedRecipe': 'Concentrated Recipe',
    'nutrition.cultivationPhases': 'Cultivation Phases',
    'nutrition.calculator': 'Calculator',
    'nutrition.dilutionCalculator': 'Dilution Calculator',
    'nutrition.waterVolume': 'Water volume (ml)',
    'nutrition.desiredConcentration': 'Desired concentration (%)',
    'nutrition.calculateDilution': 'Calculate Dilution',
    'nutrition.concentratedSolution': 'Concentrated solution',
    'nutrition.additionalWater': 'Additional water',
    'nutrition.totalVolume': 'Total volume',
    'nutrition.estimatedEC': 'Estimated EC',
    'nutrition.recommendedPH': 'Recommended pH',
    'nutrition.calculationSuccess': 'Calculation completed successfully!',
    
    // Profile
    'profile.title': 'User Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.language': 'Language',
    'profile.preferences': 'Preferences',
    'profile.updateProfile': 'Update Profile',
    'profile.profileUpdated': 'Profile updated successfully!',
    
    // Error/Success messages
    'error.generic': 'An error occurred. Please try again.',
    'error.network': 'Connection error. Check your internet.',
    'error.validation': 'Please check the provided data.',
    'success.saved': 'Saved successfully!',
    'success.deleted': 'Deleted successfully!',
    'success.updated': 'Updated successfully!',
    
    // Date/Time
    'date.today': 'Today',
    'date.yesterday': 'Yesterday',
    'date.daysAgo': 'days ago',
    'time.now': 'Now',
    'time.minutesAgo': 'minutes ago',
    'time.hoursAgo': 'hours ago'
  },
  
  'es-ES': {
    // General
    'app.name': 'VERT GROW',
    'app.tagline': 'Sistema de Gestión de Cultivo',
    'loading': 'Cargando...',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'add': 'Añadir',
    'close': 'Cerrar',
    'confirm': 'Confirmar',
    'yes': 'Sí',
    'no': 'No',
    'back': 'Atrás',
    'next': 'Siguiente',
    'previous': 'Anterior',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'export': 'Exportar',
    'import': 'Importar',
    'copy': 'Copiar',
    'download': 'Descargar',
    
    // Authentication
    'auth.login': 'Iniciar sesión',
    'auth.register': 'Registrarse',
    'auth.logout': 'Cerrar sesión',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.forgotPassword': 'Olvidé mi contraseña',
    'auth.loginTitle': 'Accede a tu cuenta',
    'auth.registerTitle': 'Crear nueva cuenta',
    'auth.welcomeBack': '¡Bienvenido de vuelta!',
    'auth.newUser': '¿Usuario nuevo?',
    'auth.existingUser': '¿Ya tienes cuenta?',
    'auth.loginHere': 'Inicia sesión aquí',
    'auth.registerHere': 'Regístrate aquí',
    
    // Menu/Navigation
    'nav.dashboard': 'Panel',
    'nav.plants': 'Plantas',
    'nav.tents': 'Carpas',
    'nav.environment': 'Ambiente',
    'nav.reports': 'Informes',
    'nav.tools': 'Herramientas',
    'nav.nutrition': 'Nutrición Mineral',
    'nav.info': 'Información',
    'nav.recipe': 'Receta Concentrada',
    'nav.schedule': 'Cronograma',
    'nav.calculator': 'Calculadora',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    'nav.more': 'Más',
    
    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.welcome': '¡Bienvenido de vuelta!',
    'dashboard.totalPlants': 'Total de Plantas',
    'dashboard.activeTents': 'Carpas Activas',
    'dashboard.checkins': 'Check-ins',
    'dashboard.lastCheckin': 'Último',
    'dashboard.noneYet': 'Ninguno aún',
    'dashboard.allHealthy': 'Todas saludables',
    'dashboard.needAttention': 'necesitan atención',
    'dashboard.configured': 'Configuradas',
    'dashboard.noneConfigured': 'Ninguna configurada',
    'dashboard.readyToStart': '¿Listo para comenzar tu cultivo?',
    'dashboard.plantsInCultivation': 'plantas en cultivo',
    'dashboard.phaseDistribution': 'Distribución por Fase',
    'dashboard.suggestedTasks': 'Tareas Sugeridas',
    'dashboard.allUpToDate': '¡Todo al día!',
    'dashboard.quickActions': 'Acciones Rápidas',
    'dashboard.newPlant': 'Nueva Planta',
    'dashboard.addToCultivation': 'Añadir al cultivo',
    'dashboard.monitor': 'Monitorear',
    'dashboard.environment': 'Ambiente',
    
    // Phases
    'phase.germination': 'Germinación',
    'phase.vegetative': 'Vegetativa',
    'phase.flowering': 'Floración',
    
    // Plants
    'plants.title': 'Gestión de Plantas',
    'plants.addNew': 'Añadir Nueva Planta',
    'plants.strain': 'Cepa',
    'plants.phase': 'Fase',
    'plants.tent': 'Carpa',
    'plants.plantingDate': 'Fecha de Plantación',
    'plants.germinationDate': 'Fecha de Germinación',
    'plants.lastCheckin': 'Último Check-in',
    'plants.checkin': 'Check-in',
    'plants.batchCheckin': 'Check-in en Lote',
    'plants.move': 'Mover',
    'plants.health': 'Salud',
    'plants.notes': 'Observaciones',
    
    // Tents
    'tents.title': 'Carpas de Cultivo',
    'tents.addNew': 'Añadir Nueva Carpa',
    'tents.name': 'Nombre',
    'tents.dimensions': 'Dimensiones',
    'tents.lighting': 'Iluminación',
    'tents.capacity': 'Capacidad',
    'tents.plants': 'plantas',
    
    // Environment
    'environment.title': 'Monitoreo Ambiental',
    'environment.temperature': 'Temperatura',
    'environment.humidity': 'Humedad',
    'environment.ph': 'pH',
    'environment.ec': 'EC',
    'environment.addRecord': 'Añadir Registro',
    'environment.filterByTent': 'Filtrar por Carpa',
    'environment.allTents': 'Todas las Carpas',
    
    // Reports
    'reports.title': 'Informes',
    'reports.plantHealth': 'Salud de las Plantas',
    'reports.environmentalData': 'Datos Ambientales',
    'reports.growthProgress': 'Progreso de Crecimiento',
    'reports.exportData': 'Exportar Datos',
    
    // Nutrition
    'nutrition.title': 'Nutrición Mineral',
    'nutrition.concentratedRecipe': 'Receta Concentrada',
    'nutrition.cultivationPhases': 'Fases del Cultivo',
    'nutrition.calculator': 'Calculadora',
    'nutrition.dilutionCalculator': 'Calculadora de Dilución',
    'nutrition.waterVolume': 'Volumen de agua (ml)',
    'nutrition.desiredConcentration': 'Concentración deseada (%)',
    'nutrition.calculateDilution': 'Calcular Dilución',
    'nutrition.concentratedSolution': 'Solución concentrada',
    'nutrition.additionalWater': 'Agua adicional',
    'nutrition.totalVolume': 'Volumen total',
    'nutrition.estimatedEC': 'EC estimado',
    'nutrition.recommendedPH': 'pH recomendado',
    'nutrition.calculationSuccess': '¡Cálculo realizado con éxito!',
    
    // Profile
    'profile.title': 'Perfil de Usuario',
    'profile.personalInfo': 'Información Personal',
    'profile.language': 'Idioma',
    'profile.preferences': 'Preferencias',
    'profile.updateProfile': 'Actualizar Perfil',
    'profile.profileUpdated': '¡Perfil actualizado con éxito!',
    
    // Error/Success messages
    'error.generic': 'Ocurrió un error. Inténtalo de nuevo.',
    'error.network': 'Error de conexión. Verifica tu internet.',
    'error.validation': 'Por favor, verifica los datos proporcionados.',
    'success.saved': '¡Guardado con éxito!',
    'success.deleted': '¡Eliminado con éxito!',
    'success.updated': '¡Actualizado con éxito!',
    
    // Date/Time
    'date.today': 'Hoy',
    'date.yesterday': 'Ayer',
    'date.daysAgo': 'días atrás',
    'time.now': 'Ahora',
    'time.minutesAgo': 'minutos atrás',
    'time.hoursAgo': 'horas atrás'
  }
};

// Idiomas disponíveis
export const availableLanguages = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' }
];

// Idioma padrão
const DEFAULT_LANGUAGE = 'pt-BR';

// Classe para gerenciar traduções
class I18n {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || DEFAULT_LANGUAGE;
    this.listeners = [];
  }

  // Obter idioma armazenado
  getStoredLanguage() {
    try {
      return localStorage.getItem('vert-grow-language');
    } catch {
      return null;
    }
  }

  // Armazenar idioma
  setStoredLanguage(language) {
    try {
      localStorage.setItem('vert-grow-language', language);
    } catch {
      // Ignorar erro se localStorage não estiver disponível
    }
  }

  // Definir idioma atual
  setLanguage(language) {
    if (translations[language]) {
      this.currentLanguage = language;
      this.setStoredLanguage(language);
      this.notifyListeners();
    }
  }

  // Obter idioma atual
  getLanguage() {
    return this.currentLanguage;
  }

  // Traduzir chave
  t(key, params = {}) {
    const translation = translations[this.currentLanguage]?.[key] || 
                       translations[DEFAULT_LANGUAGE]?.[key] || 
                       key;

    // Substituir parâmetros na tradução
    return Object.keys(params).reduce((text, param) => {
      return text.replace(`{{${param}}}`, params[param]);
    }, translation);
  }

  // Adicionar listener para mudanças de idioma
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remover listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notificar listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  // Detectar idioma do navegador
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages?.[0];
    
    // Verificar se temos tradução para o idioma do navegador
    if (translations[browserLang]) {
      return browserLang;
    }
    
    // Verificar apenas o código do idioma (ex: 'pt' de 'pt-BR')
    const langCode = browserLang?.split('-')[0];
    const matchingLang = Object.keys(translations).find(lang => 
      lang.startsWith(langCode)
    );
    
    return matchingLang || DEFAULT_LANGUAGE;
  }

  // Inicializar com idioma do navegador se não houver preferência salva
  initializeLanguage() {
    if (!this.getStoredLanguage()) {
      const detectedLang = this.detectBrowserLanguage();
      this.setLanguage(detectedLang);
    }
  }
}

// Instância global
const i18n = new I18n();

// Hook React para usar traduções
export const useTranslation = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    i18n.addListener(forceUpdate);
    return () => i18n.removeListener(forceUpdate);
  }, []);

  return {
    t: i18n.t.bind(i18n),
    language: i18n.getLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    availableLanguages
  };
};

// Exportar instância
export default i18n;

