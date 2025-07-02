// Serviço para gerenciar dados no localStorage
class LocalStorageService {
  constructor() {
    this.keys = {
      USER: 'cultivo_user',
      PLANTAS: 'cultivo_plantas',
      TENDAS: 'cultivo_tendas',
      CHECKINS: 'cultivo_checkins',
      REGISTROS_AMBIENTAIS: 'cultivo_registros_ambientais',
      ONBOARDING: 'cultivo_onboarding_completed'
    };
    
    // Inicializar dados padrão se não existirem
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Dados padrão das tendas
    if (!this.getTendas().length) {
      const tendasPadrao = [
        {
          id: 1,
          nome: 'Tenda Principal',
          dimensoes: '80x80',
          limite_plantas: 4,
          luz: {
            watts: 240,
            modelo: 'LM301h',
            quantidade_paineis: 1
          },
          plantas: []
        }
      ];
      this.setTendas(tendasPadrao);
    }
  }

  // Métodos genéricos
  setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  // Métodos específicos para usuário
  setUser(user) {
    return this.setItem(this.keys.USER, user);
  }

  getUser() {
    return this.getItem(this.keys.USER);
  }

  removeUser() {
    return this.removeItem(this.keys.USER);
  }

  // Métodos específicos para plantas
  setPlantas(plantas) {
    return this.setItem(this.keys.PLANTAS, plantas);
  }

  getPlantas() {
    return this.getItem(this.keys.PLANTAS) || [];
  }

  addPlanta(planta) {
    const plantas = this.getPlantas();
    const novaPlanta = {
      ...planta,
      id: Date.now(), // ID único baseado em timestamp
      data_criacao: new Date().toISOString(),
      data_germinacao: planta.data_germinacao || new Date().toISOString().split('T')[0]
    };
    plantas.push(novaPlanta);
    return this.setPlantas(plantas);
  }

  updatePlanta(id, dadosAtualizados) {
    const plantas = this.getPlantas();
    const index = plantas.findIndex(p => p.id === id);
    if (index !== -1) {
      plantas[index] = { ...plantas[index], ...dadosAtualizados };
      return this.setPlantas(plantas);
    }
    return false;
  }

  removePlanta(id) {
    const plantas = this.getPlantas();
    const plantasFiltradas = plantas.filter(p => p.id !== id);
    return this.setPlantas(plantasFiltradas);
  }

  // Métodos específicos para tendas
  setTendas(tendas) {
    return this.setItem(this.keys.TENDAS, tendas);
  }

  getTendas() {
    return this.getItem(this.keys.TENDAS) || [];
  }

  addTenda(tenda) {
    const tendas = this.getTendas();
    const novaTenda = {
      ...tenda,
      id: Date.now(),
      data_criacao: new Date().toISOString(),
      plantas: []
    };
    tendas.push(novaTenda);
    return this.setTendas(tendas);
  }

  updateTenda(id, dadosAtualizados) {
    const tendas = this.getTendas();
    const index = tendas.findIndex(t => t.id === id);
    if (index !== -1) {
      tendas[index] = { ...tendas[index], ...dadosAtualizados };
      return this.setTendas(tendas);
    }
    return false;
  }

  removeTenda(id) {
    const tendas = this.getTendas();
    const tendasFiltradas = tendas.filter(t => t.id !== id);
    return this.setTendas(tendasFiltradas);
  }

  // Métodos para check-ins
  setCheckins(checkins) {
    return this.setItem(this.keys.CHECKINS, checkins);
  }

  getCheckins() {
    return this.getItem(this.keys.CHECKINS) || [];
  }

  addCheckin(checkin) {
    const checkins = this.getCheckins();
    const novoCheckin = {
      ...checkin,
      id: Date.now(),
      data: new Date().toISOString()
    };
    checkins.push(novoCheckin);
    return this.setCheckins(checkins);
  }

  getCheckinsByPlanta(plantaId) {
    const checkins = this.getCheckins();
    return checkins.filter(c => c.planta_id === plantaId);
  }

  // Métodos para registros ambientais
  setRegistrosAmbientais(registros) {
    return this.setItem(this.keys.REGISTROS_AMBIENTAIS, registros);
  }

  getRegistrosAmbientais() {
    return this.getItem(this.keys.REGISTROS_AMBIENTAIS) || [];
  }

  addRegistroAmbiental(registro) {
    const registros = this.getRegistrosAmbientais();
    const novoRegistro = {
      ...registro,
      id: Date.now(),
      data: new Date().toISOString()
    };
    registros.push(novoRegistro);
    return this.setRegistrosAmbientais(registros);
  }

  // Métodos para onboarding
  setOnboardingCompleted(completed = true) {
    return this.setItem(this.keys.ONBOARDING, completed);
  }

  isOnboardingCompleted() {
    return this.getItem(this.keys.ONBOARDING) || false;
  }

  // Método para limpar todos os dados
  clearAllData() {
    Object.values(this.keys).forEach(key => {
      this.removeItem(key);
    });
    this.initializeDefaultData();
  }

  // Método para exportar dados
  exportData() {
    const data = {};
    Object.entries(this.keys).forEach(([name, key]) => {
      data[name] = this.getItem(key);
    });
    return data;
  }

  // Método para importar dados
  importData(data) {
    Object.entries(data).forEach(([name, value]) => {
      if (this.keys[name] && value !== null) {
        this.setItem(this.keys[name], value);
      }
    });
  }
}

// Instância singleton
const localStorageService = new LocalStorageService();

export default localStorageService;

