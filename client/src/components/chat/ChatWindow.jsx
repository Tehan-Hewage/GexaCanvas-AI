import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChats } from '../../hooks/useChats';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';
import Loader from '../ui/Loader';
import toast from 'react-hot-toast';

export default function ChatWindow() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const {
    activeChat,
    loadingMessages,
    sendingMessage,
    sendChatMessage,
    createNewChat,
    loadChat,
  } = useChats();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId, loadChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, sendingMessage]);

  const handleSend = async (message) => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    let targetChatId = chatId;

    // If no chat is selected, create one first
    if (!targetChatId) {
      const newChat = await createNewChat();
      if (!newChat) return;
      targetChatId = newChat._id;
      navigate(`/app/chats/${targetChatId}`, { replace: true });
    }

    try {
      await sendChatMessage(targetChatId, message);
    } catch {
      // Error already toasted in context
    }
  };

  // No chat selected
  if (!chatId) {
    return (
      <div className="flex flex-col h-full">
        <EmptyState onQuickAction={handleSend} />
        <MessageComposer onSend={handleSend} disabled={sendingMessage} />
      </div>
    );
  }

  // Loading chat
  if (loadingMessages && !activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader text="Loading conversation..." />
      </div>
    );
  }

  // Chat loaded
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {activeChat?.messages?.map((msg, i) => (
            <MessageBubble key={msg._id || i} message={msg} />
          ))}

          {sendingMessage && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <MessageComposer onSend={handleSend} disabled={sendingMessage} />
    </div>
  );
}
