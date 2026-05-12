/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gexa: {
          bg: '#05070D',
          elevated: '#0B1020',
          card: 'rgba(15, 23, 42, 0.72)',
          border: 'rgba(148, 163, 184, 0.16)',
          text: '#F8FAFC',
          muted: '#94A3B8',
          soft: '#CBD5E1',
          purple: '#7C3AED',
          'purple-hover': '#8B5CF6',
          cyan: '#22D3EE',
          emerald: '#A3E635',
          pink: '#F472B6',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        heading: [
          '"Space Grotesk"',
          '"Plus Jakarta Sans"',
          'system-ui',
          'sans-serif',
        ],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'typing-dot': 'typingDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(124, 58, 237, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.7)',
          },
        },
        typingDot: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
