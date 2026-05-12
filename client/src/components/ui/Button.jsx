import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gexa-purple/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-gexa-purple to-gexa-purple-hover text-white hover:shadow-lg hover:shadow-gexa-purple/25 active:scale-[0.98]',
    secondary:
      'bg-gexa-elevated border border-gexa-border text-gexa-text hover:bg-gexa-card hover:border-gexa-muted/30 active:scale-[0.98]',
    ghost:
      'text-gexa-muted hover:text-gexa-text hover:bg-gexa-elevated/60',
    danger:
      'bg-gexa-danger/10 text-gexa-danger border border-gexa-danger/20 hover:bg-gexa-danger/20',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
