import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Loader({ className, text }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-gexa-border" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-gexa-purple animate-spin" />
      </div>
      {text && (
        <p className="text-sm text-gexa-muted animate-pulse">{text}</p>
      )}
    </div>
  );
}
