/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A051A',
        'background-secondary': '#120A2B',
        'neon-magenta': '#FF007A',
        'neon-cyan': '#00E5FF',
        'neon-purple': '#8B5CF6',
        'glass-bg': 'rgba(255,255,255,0.05)',
        'glass-border': 'rgba(0,229,255,0.3)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-gradient': 'linear-gradient(135deg, #00E5FF 0%, #FF007A 100%)',
        'neon-gradient-horizontal': 'linear-gradient(90deg, #00E5FF 0%, #FF007A 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.5)',
        'neon-magenta': '0 0 20px rgba(255, 0, 122, 0.5)',
        'neon-glow': '0 0 40px rgba(0, 229, 255, 0.3)',
        'neon-button': '0 0 30px rgba(0, 229, 255, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
