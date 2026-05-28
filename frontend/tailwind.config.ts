import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4D4D',
          dark: '#E03535',
          light: '#FF7575',
        },
        secondary: {
          DEFAULT: '#FF8C00',
        },
        accent: '#0066FF',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FC',
        },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF4D4D, #FF8C00)',
        'gradient-blue': 'linear-gradient(135deg, #0066FF, #00B4FF)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e, #16213e)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0,0,0,0.08)',
        'hover': '0 8px 32px rgba(255,77,77,0.15)',
        'xl-soft': '0 20px 60px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
