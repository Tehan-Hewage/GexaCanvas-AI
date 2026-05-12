import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import {
  fetchChats as fetchChatsApi,
  createChat as createChatApi,
  fetchChat as fetchChatApi,
  updateChat as updateChatApi,
  deleteChat as deleteChatApi,
  sendMessage as sendMessageApi,
} from '../api/chatApi';
import { generateImage as generateImageApi } from '../api/imageApi';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  // Fetch all chats
  const loadChats = useCallback(async () => {
    if (!user) return;
    setLoadingChats(true);
    try {
      const res = await fetchChatsApi();
      setChats(res.data.chats);
    } catch (err) {
      toast.error('Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  }, [user]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load a specific chat
  const loadChat = useCallback(async (id) => {
    setLoadingMessages(true);
    try {
      const res = await fetchChatApi(id);
      setActiveChat(res.data.chat);
      return res.data.chat;
    } catch (err) {
      toast.error('Failed to load chat');
      return null;
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Create a new chat
  const createNewChat = useCallback(async () => {
    try {
      const res = await createChatApi({ title: 'New Chat' });
      const newChat = res.data.chat;
      setChats((prev) => [
        {
          ...newChat,
          lastMessage: null,
          messageCount: 0,
        },
        ...prev,
      ]);
      setActiveChat(newChat);
      toast.success('Chat created');
      return newChat;
    } catch (err) {
      toast.error('Failed to create chat');
      return null;
    }
  }, []);

  // Send a message
  const sendChatMessage = useCallback(
    async (chatId, message) => {
      setSendingMessage(true);
      try {
        const res = await sendMessageApi(chatId, message);
        const updatedChat = res.data.chat;
        const { userMessage, assistantMessage } = res.data;
        
        setActiveChat(prev => ({
          ...prev,
          ...updatedChat,
          messages: [...(prev?.messages || []), userMessage, assistantMessage]
        }));

        // Update chats list
        setChats((prev) => {
          const filtered = prev.filter((c) => c._id !== chatId);
          const lastMsg = assistantMessage;
          return [
            {
              ...updatedChat,
              lastMessage: lastMsg
                ? {
                    content:
                      lastMsg.type === 'image'
                        ? '🖼️ Image generated'
                        : lastMsg.content?.substring(0, 100) || '',
                    role: lastMsg.role,
                    createdAt: lastMsg.created_at || lastMsg.createdAt,
                  }
                : null,
              messageCount: (activeChat?.messages?.length || 0) + 2,
              messages: undefined,
            },
            ...filtered,
          ];
        });

        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message || 'Failed to send message';
        toast.error(msg);
        throw err;
      } finally {
        setSendingMessage(false);
      }
    },
    []
  );

  // Pin/unpin chat
  const togglePin = useCallback(async (chatId, pinned) => {
    try {
      await updateChatApi(chatId, { pinned });
      setChats((prev) =>
        prev
          .map((c) => (c._id === chatId ? { ...c, pinned } : c))
          .sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
            return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
          })
      );
      setActiveChat((prev) =>
        prev?._id === chatId ? { ...prev, pinned } : prev
      );
      toast.success(pinned ? 'Chat pinned' : 'Chat unpinned');
    } catch (err) {
      toast.error('Failed to update chat');
    }
  }, []);

  // Delete a chat
  const removeChat = useCallback(
    async (chatId) => {
      try {
        await deleteChatApi(chatId);
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        if (activeChat?._id === chatId) {
          setActiveChat(null);
        }
        toast.success('Chat deleted');
      } catch (err) {
        toast.error('Failed to delete chat');
      }
    },
    [activeChat]
  );

  // Generate image
  const generateImageInChat = useCallback(
    async (prompt, chatId) => {
      setGeneratingImage(true);
      try {
        const res = await generateImageApi({ prompt, chatId });
        const updatedChat = res.data.chat;
        const { userMessage, assistantMessage } = res.data;
        
        setActiveChat(prev => ({
          ...prev,
          ...updatedChat,
          messages: [...(prev?.messages || []), userMessage, assistantMessage]
        }));

        // Refresh chats list
        await loadChats();

        toast.success('Image generated!');
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message || 'Image generation failed';
        toast.error(msg);
        throw err;
      } finally {
        setGeneratingImage(false);
      }
    },
    [loadChats]
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        loadingChats,
        loadingMessages,
        sendingMessage,
        generatingImage,
        setActiveChat,
        loadChats,
        loadChat,
        createNewChat,
        sendChatMessage,
        togglePin,
        removeChat,
        generateImageInChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
