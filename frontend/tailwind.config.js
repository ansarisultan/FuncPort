/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#050816',
          800: '#0A1020',
          700: '#10182D',
        },
        primary: {
          400: '#67E8F9',
          500: '#22D3EE',
          600: '#0891B2',
        },
        secondary: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        accent: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        warm: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        success: {
          400: '#4ADE80',
          500: '#22C55E',
        },
        danger: {
          400: '#F87171',
          500: '#EF4444',
        },
        surface: {
          900: '#050816',
          800: '#0A1020',
          700: '#10182D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #22D3EE, #3B82F6)',
        'gradient-cyber': 'linear-gradient(135deg, #22D3EE, #3B82F6, #6366F1)',
        'gradient-warm': 'linear-gradient(135deg, #F59E0B, #6366F1, #22D3EE)',
        'gradient-glass': 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(59,130,246,0.05))',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        glow: '0 0 30px rgba(34,211,238,0.15)',
        'glow-primary': '0 0 40px rgba(34,211,238,0.3)',
        'glow-secondary': '0 0 40px rgba(59,130,246,0.3)',
        'glow-accent': '0 0 40px rgba(99,102,241,0.3)',
        'glow-warm': '0 0 40px rgba(245,158,11,0.3)',
        '3d': '0 20px 60px -10px rgba(0,0,0,0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 20px rgba(34,211,238,0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(34,211,238,0.3)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
