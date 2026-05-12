import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gexa-soft mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl bg-gexa-elevated border border-gexa-border',
          'text-gexa-text placeholder-gexa-muted/60 font-body text-sm',
          'focus:outline-none focus:ring-2 focus:ring-gexa-purple/50 focus:border-gexa-purple/50',
          'transition-all duration-200',
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
});

Input.displayName = 'Input';
export default Input;
