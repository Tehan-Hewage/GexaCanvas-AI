import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative glass-panel p-6 w-full max-w-sm animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 text-gexa-muted hover:text-gexa-text transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gexa-danger/10">
            <AlertTriangle className="w-5 h-5 text-gexa-danger" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-gexa-text">
              {title}
            </h3>
            <p className="text-sm text-gexa-muted mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
