import { X } from 'lucide-react';

export default function MobileSidebar({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 left-0 w-[300px] bg-gexa-bg border-r border-gexa-border animate-slide-in-left overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-3 p-1.5 rounded-lg text-gexa-muted hover:text-gexa-text hover:bg-gexa-elevated transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
