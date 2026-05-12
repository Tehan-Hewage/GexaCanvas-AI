import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MessageComposer({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gexa-border bg-gexa-bg/80 backdrop-blur-xl p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 glass-panel-sm p-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-gexa-text placeholder-gexa-muted/50 text-sm px-3 py-2 focus:outline-none max-h-40"
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className={cn(
              'p-2.5 rounded-xl transition-all duration-200 shrink-0',
              text.trim() && !disabled
                ? 'bg-gradient-to-r from-gexa-purple to-gexa-purple-hover text-white hover:shadow-lg hover:shadow-gexa-purple/25'
                : 'bg-gexa-elevated text-gexa-muted cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            {disabled ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Sparkles className="w-3 h-3 text-gexa-muted/40" />
          <span className="text-[10px] text-gexa-muted/40 font-mono">
            Gemini-powered response
          </span>
        </div>
      </div>
    </div>
  );
}
