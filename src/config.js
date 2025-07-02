// Configuração da API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://60h5imce89jn.manus.space' 
  : 'http://localhost:5002';

export { API_BASE_URL };

