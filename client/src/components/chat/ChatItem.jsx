import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatDate';
import { Pin, Trash2, MessageSquare, Image } from 'lucide-react';

export default function ChatItem({
  chat,
  isActive,
  onSelect,
  onPin,
  onDelete,
}) {
  const modeIcon =
    chat.mode === 'image' ? (
      <Image className="w-3.5 h-3.5" />
    ) : (
      <MessageSquare className="w-3.5 h-3.5" />
    );

  return (
    <div
      onClick={() => onSelect(chat._id)}
      className={cn(
        'group relative px-3 py-3 rounded-xl cursor-pointer transition-all duration-200',
        'hover:bg-gexa-elevated/80',
        isActive &&
          'bg-gradient-to-r from-gexa-purple/10 to-gexa-cyan/5 border border-gexa-purple/30'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(chat._id)}
      aria-label={`Chat: ${chat.title}`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            'mt-0.5 p-1.5 rounded-lg shrink-0',
            isActive
              ? 'bg-gexa-purple/20 text-gexa-purple'
              : 'bg-gexa-elevated text-gexa-muted'
          )}
        >
          {modeIcon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="text-sm font-medium text-gexa-text truncate flex-1">
              {chat.title}
            </h4>
            {chat.pinned && (
              <Pin className="w-3 h-3 text-gexa-cyan shrink-0 animate-pulse-glow fill-gexa-cyan/30" />
            )}
          </div>

          {chat.lastMessage && (
            <p className="text-xs text-gexa-muted truncate">
              {chat.lastMessage.content}
            </p>
          )}

          <p className="text-[10px] text-gexa-muted/60 mt-1 font-mono">
            {formatDate(chat.lastMessageAt || chat.updatedAt)}
          </p>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(chat._id, !chat.pinned);
          }}
          className={cn(
            'p-1 rounded-lg transition-colors',
            chat.pinned
              ? 'text-gexa-cyan hover:bg-gexa-cyan/10'
              : 'text-gexa-muted hover:bg-gexa-elevated hover:text-gexa-text'
          )}
          aria-label={chat.pinned ? 'Unpin chat' : 'Pin chat'}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat._id);
          }}
          className="p-1 rounded-lg text-gexa-muted hover:bg-gexa-danger/10 hover:text-gexa-danger transition-colors"
          aria-label="Delete chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
