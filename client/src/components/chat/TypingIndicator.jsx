export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gexa-cyan/20 to-gexa-purple/20 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-gexa-cyan">AI</span>
      </div>
      <div className="glass-panel-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full bg-gexa-purple animate-typing-dot"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-gexa-purple animate-typing-dot"
            style={{ animationDelay: '200ms' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-gexa-purple animate-typing-dot"
            style={{ animationDelay: '400ms' }}
          />
        </div>
      </div>
    </div>
  );
}
