import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/brand/gexacanvas-logo.png" 
              alt="GexaCanvas AI" 
              className="h-10 object-contain"
            />
          </div>
          <p className="text-gexa-muted text-sm">
            Chat smarter. Create visually.
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8">{children}</div>
      </div>
    </div>
  );
}
