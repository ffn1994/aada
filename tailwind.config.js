/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f0f4f8',
          card:    '#ffffff',
          elevated:'#f8fafc',
        },
        accent: {
          DEFAULT: '#3b82f6',
          dark:    '#2563eb',
          light:   '#60a5fa',
        },
      },
      boxShadow: {
        glow:    '0 0 24px rgba(59,130,246,0.35)',
        'glow-sm':'0 0 12px rgba(59,130,246,0.2)',
        card:    '0 4px 24px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
