import { Copy, ExternalLink, Download } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function GeneratedImageCard({ imageUrl, prompt, createdAt }) {
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt || '');
    toast.success('Prompt copied!');
  };

  const handleOpenImage = () => {
    window.open(imageUrl, '_blank');
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `gexacanvas-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="glass-panel-sm overflow-hidden max-w-sm animate-slide-up">
      {/* Image */}
      <div className="relative group">
        <img
          src={imageUrl}
          alt={prompt || 'Generated image'}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleOpenImage}
            className="p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Open image in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Download image"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="p-3">
        <p className="text-xs text-gexa-muted line-clamp-2 mb-2">{prompt}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gexa-muted/60 font-mono">
            {formatDate(createdAt)}
          </span>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1 text-[10px] text-gexa-muted hover:text-gexa-cyan transition-colors"
            aria-label="Copy prompt"
          >
            <Copy className="w-3 h-3" />
            Copy prompt
          </button>
        </div>
      </div>
    </div>
  );
}
