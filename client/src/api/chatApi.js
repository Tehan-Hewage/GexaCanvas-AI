import api from './axios';

export const fetchChats = () => api.get('/chats');
export const createChat = (data) => api.post('/chats', data);
export const fetchChat = (id) => api.get(`/chats/${id}`);
export const updateChat = (id, data) => api.patch(`/chats/${id}`, data);
export const deleteChat = (id) => api.delete(`/chats/${id}`);
export const sendMessage = (id, message) =>
  api.post(`/chats/${id}/messages`, { message });
