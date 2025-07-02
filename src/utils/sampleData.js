const SUPABASE_URL = 'https://yipmmqhbvsmizltrscai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG1tcWhidnNtaXpsdHJzY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzMwNjAsImV4cCI6MjA2NzAwOTA2MH0.iYvhF1tLSk2oXOichsDk8NiRMAcD1JD2J3gs0xD_6VI';

const getAuthHeaders = () => {
  const token = localStorage.getItem('supabase_token');
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${token}`
  };
};

export const createSampleData = async (userId) => {
  try {
    console.log('Criando dados de exemplo para usuário:', userId);

    // 1. Criar tenda de exemplo
    const tendaData = {
      nome: 'Tenda Principal',
      dimensoes: '80x80',
      altura: 200,
      watts: 240,
      modelo_led: 'LM301h',
      quantidade_paineis: 1,
      altura_luz: 60,
      limite_plantas: 4,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const tendaResponse = await fetch(`${SUPABASE_URL}/rest/v1/tendas`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(tendaData),
    });

    if (!tendaResponse.ok) {
      throw new Error('Erro ao criar tenda de exemplo');
    }

    const [tenda] = await tendaResponse.json();
    console.log('Tenda criada:', tenda);

    // 2. Criar planta de exemplo
    const hoje = new Date();
    const dataGerminacao = new Date(hoje.getTime() - (15 * 24 * 60 * 60 * 1000)); // 15 dias atrás
    const dataPlantio = new Date(dataGerminacao.getTime() - (3 * 24 * 60 * 60 * 1000)); // 3 dias antes da germinação

    const plantaData = {
      strain: 'White Widow',
      origem: 'Semente',
      data_plantio: dataPlantio.toISOString().split('T')[0],
      data_germinacao: dataGerminacao.toISOString().split('T')[0],
      vaso_litragem: 10,
      fase_atual: 'vegetativa',
      tenda_id: tenda.id,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const plantaResponse = await fetch(`${SUPABASE_URL}/rest/v1/plantas`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(plantaData),
    });

    if (!plantaResponse.ok) {
      throw new Error('Erro ao criar planta de exemplo');
    }

    const [planta] = await plantaResponse.json();
    console.log('Planta criada:', planta);

    // 3. Criar alguns registros ambientais de exemplo
    const registrosAmbientais = [
      {
        data_registro: new Date(hoje.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        temperatura: 26.5,
        umidade: 58.0,
        tenda_id: tenda.id,
        user_id: userId,
        observacoes: 'Condições ideais para crescimento',
        created_at: new Date().toISOString()
      },
      {
        data_registro: new Date(hoje.getTime() - (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        temperatura: 28.0,
        umidade: 55.5,
        tenda_id: tenda.id,
        user_id: userId,
        observacoes: 'Temperatura um pouco alta, ajustei ventilação',
        created_at: new Date().toISOString()
      },
      {
        data_registro: hoje.toISOString().split('T')[0],
        temperatura: 25.5,
        umidade: 60.0,
        tenda_id: tenda.id,
        user_id: userId,
        observacoes: 'Condições perfeitas hoje',
        created_at: new Date().toISOString()
      }
    ];

    for (const registro of registrosAmbientais) {
      const registroResponse = await fetch(`${SUPABASE_URL}/rest/v1/registros_ambientais`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(registro),
      });

      if (!registroResponse.ok) {
        console.error('Erro ao criar registro ambiental:', await registroResponse.text());
      }
    }

    // 4. Criar alguns check-ins de exemplo
    const checkins = [
      {
        planta_id: planta.id,
        data: new Date(hoje.getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        tarefas_concluidas: ['Rega', 'Verificação de pragas'],
        observacoes: 'Planta crescendo bem, sem sinais de pragas',
        created_at: new Date().toISOString()
      },
      {
        planta_id: planta.id,
        data: new Date(hoje.getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        tarefas_concluidas: ['Rega', 'LST (Low Stress Training)', 'Medição pH'],
        observacoes: 'Aplicado LST para melhor distribuição da luz. pH em 6.2',
        created_at: new Date().toISOString()
      }
    ];

    for (const checkin of checkins) {
      const checkinResponse = await fetch(`${SUPABASE_URL}/rest/v1/checkins_planta`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(checkin),
      });

      if (!checkinResponse.ok) {
        console.error('Erro ao criar check-in:', await checkinResponse.text());
      }
    }

    console.log('Dados de exemplo criados com sucesso!');
    return true;

  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error);
    return false;
  }
};

export const checkIfUserHasData = async (userId) => {
  try {
    // Verificar se o usuário já tem tendas
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tendas?user_id=eq.${userId}&limit=1`, {
      headers: getAuthHeaders()
    });

    if (response.ok) {
      const data = await response.json();
      return data.length > 0;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao verificar dados do usuário:', error);
    return false;
  }
};

