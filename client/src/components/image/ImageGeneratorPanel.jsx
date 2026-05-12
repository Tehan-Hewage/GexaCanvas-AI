import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Image,
  Sparkles,
  Loader2,
  Wand2,
} from 'lucide-react';
import { useChats } from '../../hooks/useChats';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const promptChips = [
  'Cinematic',
  'Neon city',
  'Product render',
  'Anime style',
  'Minimal poster',
  '3D icon',
];

export default function ImageGeneratorPanel() {
  const { chatId } = useParams();
  const { generatingImage, generateImageInChat } = useChats();
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }

    try {
      await generateImageInChat(prompt.trim(), chatId || undefined);
      setPrompt('');
    } catch {
      // Error already toasted
    }
  };

  const handleChip = (chip) => {
    setPrompt((prev) => {
      const separator = prev.trim() ? ', ' : '';
      return prev + separator + chip.toLowerCase();
    });
  };

  return (
    <div className="glass-panel p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-gexa-pink/20 to-gexa-purple/20">
          <Image className="w-5 h-5 text-gexa-pink" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-gexa-text text-sm">
            Image Canvas
          </h3>
          <p className="text-[10px] text-gexa-muted font-mono">
            Hugging Face • FLUX.1-schnell
          </p>
        </div>
      </div>

      {/* Prompt */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to create..."
        rows={3}
        disabled={generatingImage}
        className="w-full resize-none bg-gexa-elevated border border-gexa-border rounded-xl px-4 py-3 text-sm text-gexa-text placeholder-gexa-muted/50 focus:outline-none focus:ring-1 focus:ring-gexa-purple/40 transition-all mb-3"
        aria-label="Image prompt"
      />

      {/* Prompt chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {promptChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChip(chip)}
            disabled={generatingImage}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-gexa-elevated border border-gexa-border text-gexa-muted hover:text-gexa-text hover:border-gexa-purple/30 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        loading={generatingImage}
        disabled={!prompt.trim()}
        className="w-full"
        size="md"
      >
        {generatingImage ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate Image
          </>
        )}
      </Button>

      {/* Loading skeleton */}
      {generatingImage && (
        <div className="mt-4 rounded-xl bg-gexa-elevated border border-gexa-border aspect-square w-full animate-pulse flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-gexa-purple/40 mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-gexa-muted">
              Creating your image...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
