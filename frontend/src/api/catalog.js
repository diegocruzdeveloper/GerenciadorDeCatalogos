import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const catalogApi = {
  // Listar todos os itens do catálogo
  listarItens: async () => {
    const response = await api.get('/ListarItensCatalogo');
    return response.data;
  },

  // Salvar um novo item no catálogo
  salvarItem: async (item) => {
    const response = await api.post('/SalvarItemCatalogo', item);
    return response.data;
  },

  // Filtrar itens por categoria
  filtrarItens: async (categoria) => {
    const response = await api.get(`/FiltrarItensCatalogo?categoria=${encodeURIComponent(categoria)}`);
    return response.data;
  },

  // Upload de imagem
  uploadImagem: async (formData) => {
    const response = await api.post('/UploadImagemCatalogo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
