// Configuração do Supabase
export const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

// Headers padrão para requisições ao Supabase
export const getSupabaseHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Prefer': 'return=representation'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// URLs das principais tabelas
export const SUPABASE_TABLES = {
  USER_PROFILES: `${SUPABASE_URL}/rest/v1/user_profiles`,
  PLANTAS: `${SUPABASE_URL}/rest/v1/plantas`,
  TENDAS: `${SUPABASE_URL}/rest/v1/tendas`,
  CHECKINS_PLANTA: `${SUPABASE_URL}/rest/v1/checkins_planta`,
  REGISTROS_AMBIENTAIS: `${SUPABASE_URL}/rest/v1/registros_ambientais`,
  ONBOARDING_DATA: `${SUPABASE_URL}/rest/v1/onboarding_data`
};

// Configurações de autenticação
export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    USER: 'vert-grow-user',
    TOKEN: 'vert-grow-token',
    ONBOARDING: 'vert-grow-onboarding'
  }
};

