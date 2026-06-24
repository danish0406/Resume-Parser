/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080C10',     // Pitch Black-Navy
        surface: '#172330',        // Dark Teal-Slate
        primary: {
          DEFAULT: '#FF763D',      // Vibrant Orange
          glow: 'rgba(255,118,61,0.15)'
        },
        secondary: '#FFA37A',      // Light Warm Orange/Coral
        success: '#10B981',        // emerald
        textPrimary: '#EAEFF2',    // Off-white/Light Gray
        textMuted: '#8A9CA8',      // Slate/Cool Gray-Blue
        borderDark: '#253746'       // Slate-Teal Border
      },
      borderRadius: {
        '2xl': '1rem',             // 16px (cards)
        'card': '1rem',
        'badge': '9999px'          // badges
      },
      boxShadow: {
        'active-glow': '0 0 30px rgba(255,118,61,0.15)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.5)'
      },
      transitionProperty: {
        'all-ease': 'all 200ms ease'
      }
    },
  },
  plugins: [],
}
