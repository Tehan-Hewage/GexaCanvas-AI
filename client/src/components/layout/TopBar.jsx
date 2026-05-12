import { useParams } from 'react-router-dom';
import {
  Menu,
  Pin,
  LogOut,
  Image,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChats } from '../../hooks/useChats';

export default function TopBar({ onMenuClick, onImageClick, imageOpen }) {
  const { user, profile, logout } = useAuth();
  const { activeChat, togglePin } = useChats();
  const { chatId } = useParams();

  const displayName = profile?.name || user?.user_metadata?.name || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 border-b border-gexa-border bg-gexa-bg/60 backdrop-blur-xl flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gexa-muted hover:text-gexa-text hover:bg-gexa-elevated transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeChat && chatId ? (
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-heading font-semibold text-gexa-text truncate">
              {activeChat.title}
            </h2>
            <button
              onClick={() => togglePin(chatId, !activeChat.pinned)}
              className={`p-1 rounded-lg transition-colors shrink-0 ${
                activeChat.pinned
                  ? 'text-gexa-cyan hover:bg-gexa-cyan/10'
                  : 'text-gexa-muted hover:text-gexa-text hover:bg-gexa-elevated'
              }`}
              aria-label={
                activeChat.pinned ? 'Unpin chat' : 'Pin chat'
              }
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <h2 className="text-sm font-heading font-medium text-gexa-muted">
            GexaCanvas AI
          </h2>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={onImageClick}
          className={`p-2 rounded-xl transition-colors ${
            imageOpen
              ? 'text-gexa-pink bg-gexa-pink/10'
              : 'text-gexa-muted hover:text-gexa-text hover:bg-gexa-elevated'
          }`}
          aria-label={imageOpen ? 'Close image panel' : 'Open image panel'}
        >
          {imageOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Image className="w-4 h-4" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gexa-purple to-gexa-cyan flex items-center justify-center">
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl text-gexa-muted hover:text-gexa-danger hover:bg-gexa-danger/10 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
