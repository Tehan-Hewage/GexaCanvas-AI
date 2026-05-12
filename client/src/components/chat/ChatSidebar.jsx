import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Sparkles,
  Pin,
  MessageSquare,
} from 'lucide-react';
import { useChats } from '../../hooks/useChats';
import ChatItem from './ChatItem';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';

export default function ChatSidebar({ onClose }) {
  const {
    chats,
    loadingChats,
    createNewChat,
    togglePin,
    removeChat,
    loadChat,
    setActiveChat,
  } = useChats();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    const q = search.toLowerCase();
    return chats.filter((c) =>
      c.title.toLowerCase().includes(q)
    );
  }, [chats, search]);

  const pinnedChats = filteredChats.filter((c) => c.pinned);
  const recentChats = filteredChats.filter((c) => !c.pinned);

  const handleSelect = async (id) => {
    navigate(`/app/chats/${id}`);
    await loadChat(id);
    if (onClose) onClose();
  };

  const handleNewChat = async () => {
    const chat = await createNewChat();
    if (chat) {
      navigate(`/app/chats/${chat._id}`);
      if (onClose) onClose();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeChat(deleteTarget);
    setDeleteTarget(null);
    if (chatId === deleteTarget) {
      navigate('/app');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <img 
            src="/brand/gexacanvas-logo.png" 
            alt="GexaCanvas AI" 
            className="h-7 object-contain"
          />
        </div>
        <p className="text-[11px] text-gexa-muted font-mono pl-8">
          Chat smarter. Create visually.
        </p>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-3">
        <Button
          onClick={handleNewChat}
          className="w-full"
          size="md"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gexa-muted" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-gexa-elevated border border-gexa-border text-gexa-text placeholder-gexa-muted/50 focus:outline-none focus:ring-1 focus:ring-gexa-purple/40 transition-all"
            aria-label="Search chats"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {loadingChats ? (
          <div className="space-y-2 px-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-gexa-elevated/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageSquare className="w-8 h-8 text-gexa-muted/40 mx-auto mb-3" />
            <p className="text-sm text-gexa-muted">
              {search ? 'No chats match your search' : 'No chats yet'}
            </p>
            {!search && (
              <p className="text-xs text-gexa-muted/60 mt-1">
                Start a new conversation
              </p>
            )}
          </div>
        ) : (
          <>
            {pinnedChats.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <Pin className="w-3 h-3 text-gexa-cyan" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gexa-muted">
                    Pinned
                  </span>
                </div>
                {pinnedChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={chatId === chat._id}
                    onSelect={handleSelect}
                    onPin={togglePin}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}

            {recentChats.length > 0 && (
              <div>
                {pinnedChats.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-2 mt-2">
                    <MessageSquare className="w-3 h-3 text-gexa-muted" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gexa-muted">
                      Recent
                    </span>
                  </div>
                )}
                {recentChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={chatId === chat._id}
                    onSelect={handleSelect}
                    onPin={togglePin}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete chat?"
        message="This will permanently delete this chat and all its messages."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
