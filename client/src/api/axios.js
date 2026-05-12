import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Though Supabase uses Bearer tokens, good for other cookies
});

// Request interceptor to attach Supabase access token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    
    if (error.response?.status === 401) {
      // Token might be expired
      toast.error('Session expired. Please log in again.');
      await supabase.auth.signOut();
      // Only redirect if not already on login/register to avoid loops
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
