import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

export function useChats() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChats must be used within a ChatProvider');
  }
  return context;
}
