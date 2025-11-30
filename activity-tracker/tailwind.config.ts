import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0F',
          secondary: '#0F0F14',
        },
        surface: {
          DEFAULT: '#16161D',
          elevated: '#1C1C24',
          hover: '#22222A',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.12)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          tertiary: '#71717A',
          muted: '#52525B',
        },
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        accent: {
          cyan: '#06B6D4',
          pink: '#EC4899',
          amber: '#F59E0B',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.3)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBB23C',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.3)',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
          glow: 'rgba(239, 68, 68, 0.3)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px var(--tw-shadow-color)',
        'glow-md': '0 0 30px -5px var(--tw-shadow-color)',
        'glow-lg': '0 0 40px -5px var(--tw-shadow-color)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'elevation-sm': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'elevation-md': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'elevation-lg': '0 8px 32px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #FBB23C 100%)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px var(--tw-shadow-color)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px var(--tw-shadow-color)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
