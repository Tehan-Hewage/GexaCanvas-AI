import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gexa-soft mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-xl bg-gexa-elevated border border-gexa-border',
            'text-gexa-text placeholder-gexa-muted/60 font-body text-sm',
            'focus:outline-none focus:ring-2 focus:ring-gexa-purple/50 focus:border-gexa-purple/50',
            'transition-all duration-200 resize-none',
            error && 'border-gexa-danger/50 focus:ring-gexa-danger/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-gexa-danger">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
