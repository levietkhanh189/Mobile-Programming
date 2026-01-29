/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#818CF8',
          dark: '#3730A3',
        },
        cta: '#F97316',
        background: '#EEF2FF',
        'text-primary': '#1E1B4B',
        'text-secondary': '#6366F1',
        glass: {
          surface: 'rgba(255, 255, 255, 0.25)',
          border: 'rgba(255, 255, 255, 0.4)',
          overlay: 'rgba(255, 255, 255, 0.15)',
        },
        error: '#EF4444',
        success: '#10B981',
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        opensans: ['OpenSans_400Regular'],
        'opensans-semibold': ['OpenSans_600SemiBold'],
      },
    },
  },
  plugins: [],
}
