import {
  Sparkles,
  Lightbulb,
  FileText,
  Image,
  AlignLeft,
} from 'lucide-react';

const quickActions = [
  {
    icon: Lightbulb,
    title: 'Explain a concept',
    prompt: 'Explain how DNS works in simple terms',
    color: 'text-gexa-warning',
    bg: 'bg-gexa-warning/10',
  },
  {
    icon: FileText,
    title: 'Write a project plan',
    prompt: 'Create a project plan for a mobile app',
    color: 'text-gexa-emerald',
    bg: 'bg-gexa-emerald/10',
  },
  {
    icon: Image,
    title: 'Generate an image prompt',
    prompt: 'Write a creative image prompt for a futuristic city',
    color: 'text-gexa-cyan',
    bg: 'bg-gexa-cyan/10',
  },
  {
    icon: AlignLeft,
    title: 'Summarize text',
    prompt: 'Summarize the key principles of good UI design',
    color: 'text-gexa-pink',
    bg: 'bg-gexa-pink/10',
  },
];

export default function EmptyState({ onQuickAction }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center animate-fade-in">
        {/* Hero icon */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gexa-purple/20 to-gexa-cyan/20 flex items-center justify-center mx-auto overflow-hidden">
            <img src="/brand/gexacanvas-icon.png" alt="GexaCanvas Icon" className="w-12 h-12 object-contain drop-shadow-md" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-gexa-cyan/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gexa-cyan animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-heading font-bold text-gexa-text mb-2">
          Start creating with GexaCanvas AI
        </h2>
        <p className="text-gexa-muted text-sm mb-8 max-w-sm mx-auto">
          Ask a question, brainstorm ideas, or generate a visual from a prompt.
        </p>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => onQuickAction?.(action.prompt)}
              className="glass-panel-sm p-4 text-left hover:border-gexa-purple/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${action.bg} shrink-0`}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gexa-text group-hover:text-gexa-purple transition-colors">
                    {action.title}
                  </p>
                  <p className="text-xs text-gexa-muted mt-0.5 line-clamp-1">
                    {action.prompt}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
