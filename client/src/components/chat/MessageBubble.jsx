import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../utils/cn';
import GeneratedImageCard from '../image/GeneratedImageCard';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isImage = message.type === 'image';

  if (isImage) {
    return (
      <div className="flex justify-start animate-slide-up">
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gexa-cyan/20 to-gexa-purple/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-gexa-cyan">AI</span>
          </div>
          <GeneratedImageCard
            imageUrl={message.image_url || message.imageUrl}
            prompt={message.prompt || message.content}
            createdAt={message.created_at || message.createdAt}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex animate-slide-up',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex items-start gap-3 max-w-[85%]',
          isUser && 'flex-row-reverse'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
            isUser
              ? 'bg-gradient-to-br from-gexa-purple to-gexa-purple-hover'
              : 'bg-gradient-to-br from-gexa-cyan/20 to-gexa-purple/20'
          )}
        >
          <span
            className={cn(
              'text-xs font-bold',
              isUser ? 'text-white' : 'text-gexa-cyan'
            )}
          >
            {isUser ? 'U' : 'AI'}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-gradient-to-r from-gexa-purple to-gexa-purple-hover text-white'
              : 'glass-panel-sm text-gexa-soft'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-gexa">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
