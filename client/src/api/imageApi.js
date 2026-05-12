import api from './axios';

export const generateImage = (data) => api.post('/images/generate', data);
