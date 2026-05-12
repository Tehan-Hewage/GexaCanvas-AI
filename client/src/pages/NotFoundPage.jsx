import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gexa-purple/20 to-gexa-cyan/20 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-gexa-purple" />
        </div>

        <h1 className="text-6xl font-heading font-bold text-gexa-text mb-2">
          404
        </h1>
        <p className="text-gexa-muted mb-6">
          This page doesn&apos;t exist in the GexaCanvas universe.
        </p>

        <Link to="/app">
          <Button>
            <ArrowLeft className="w-4 h-4" />
            Back to GexaCanvas
          </Button>
        </Link>
      </div>
    </div>
  );
}
