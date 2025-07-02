const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const getAuthHeaders = () => {
  const token = localStorage.getItem("vert-grow-token");
  if (!token) {
    console.error("Erro: Token de autenticação não encontrado no localStorage.");
    // Retornar apenas a chave anon para requisições que não precisam de autenticação de usuário
    return {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    };
  }
  return {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${token}`
  };
};

// Verificar se o usuário já completou o onboarding
export const checkOnboardingStatus = async (userId) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 && data[0].onboarding_completed;
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar status do onboarding:', error);
    return false;
  }
};

// Salvar dados do onboarding
export const saveOnboardingData = async (userId, onboardingData) => {
  try {
    console.log('Salvando dados do onboarding:', { userId, onboardingData });
    
    // Primeiro, verificar se já existe um perfil
    const existingResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}`, {
      headers: getAuthHeaders()
    });
    
    console.log('Resposta da verificação:', existingResponse.status);
    
    const profileData = {
      user_id: userId,
      nome: onboardingData.nome || '',
      experiencia: onboardingData.experiencia || '',
      tipo_cultivo: onboardingData.tipoCultivo || '',
      tamanho_espaco: onboardingData.tamanhoEspaco || '',
      iluminacao: onboardingData.iluminacao || '',
      ventilacao: onboardingData.ventilacao || '',
      objetivos: Array.isArray(onboardingData.objetivos) ? onboardingData.objetivos : [],
      onboarding_completed: true
    };

    console.log('Dados do perfil a serem salvos:', profileData);

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      
      if (existingData.length > 0) {
        console.log('Atualizando perfil existente...');
        // Atualizar perfil existente
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}`, {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            ...profileData,
            updated_at: new Date().toISOString()
          })
        });
        
        console.log('Resposta da atualização:', updateResponse.status);
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Erro na atualização:', errorText);
          return false;
        }
        
        return true;
      }
    }
    
    console.log('Criando novo perfil...');
    // Criar novo perfil
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(profileData)
    });
    
    console.log('Resposta da criação:', createResponse.status);
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Erro na criação:', errorText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados do onboarding:', error);
    return false;
  }
};

// Obter dados do perfil do usuário
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    return null;
  }
};

// Criar dados de exemplo após onboarding
export const createInitialData = async (userId, profileData) => {
  try {
    console.log('Criando dados iniciais para o usuário:', userId);
    
    // Criar tenda de exemplo baseada no perfil
    const tendaExemplo = {
      user_id: userId,
      nome: 'Tenda Principal',
      dimensoes: profileData.tamanho_espaco || '80x80',
      altura: 200,
      watts: profileData.iluminacao === 'LED' ? 240 : 150,
      modelo_led: 'LM301h',
      quantidade_paineis: 1,
      altura_luz: 60,
      limite_plantas: profileData.tamanho_espaco === '100x100' ? 6 : 4
    };

    console.log('Criando tenda de exemplo:', tendaExemplo);

    const tendaResponse = await fetch(`${SUPABASE_URL}/rest/v1/tendas`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(tendaExemplo)
    });

    console.log('Resposta da criação da tenda:', tendaResponse.status);

    if (tendaResponse.ok) {
      const tendaData = await tendaResponse.json();
      const tendaId = tendaData[0].id;

      console.log('Tenda criada com ID:', tendaId);

      // Criar planta de exemplo
      const plantaExemplo = {
        user_id: userId,
        tenda_id: tendaId,
        strain: 'White Widow',
        origem: 'Semente',
        data_plantio: new Date().toISOString().split('T')[0],
        data_germinacao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        vaso_litragem: 10,
        fase_atual: 'germinacao'
      };

      console.log('Criando planta de exemplo:', plantaExemplo);

      const plantaResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(plantaExemplo)
      });

      console.log('Resposta da criação da planta:', plantaResponse.status);

      // Criar registro ambiental de exemplo
      const registroAmbiental = {
        user_id: userId,
        tenda_id: tendaId,
        temperatura: 24,
        umidade: 60,
        ph: 6.5,
        ec: 1.2,
        data_registro: new Date().toISOString().split('T')[0],
        observacoes: 'Condições ideais para germinação'
      };

      console.log('Criando registro ambiental de exemplo:', registroAmbiental);

      const registroResponse = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(registroAmbiental)
      });

      console.log('Resposta da criação do registro:', registroResponse.status);
    } else {
      const errorText = await tendaResponse.text();
      console.error('Erro ao criar tenda:', errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
    return false;
  }
};

