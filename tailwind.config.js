/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        pastel: {
          pink: '#fce4ec',
          lavender: '#ede7f6',
          mint: '#e0f2f1',
          blue: '#e3f2fd',
          peach: '#fff3e0',
          rose: '#ec70a0',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(200, 180, 230, 0.4)',
        },
      },
    },
  },
  plugins: [],
}
