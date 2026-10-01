/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0A1C16',
          900: '#122C23',
          800: '#1A3D31',
          700: '#245242',
          600: '#2F6A56',
          500: '#3C846C',
          100: '#E5F0EC',
          50: '#F2F7F5'
        },
        sage: {
          700: '#3E5848',
          600: '#4E6F5B',
          500: '#688A75',
          300: '#9BB6A4',
          200: '#C3D5C9',
          100: '#E4ECE7',
          50: '#F3F7F5'
        },
        clay: {
          700: '#963C1B',
          600: '#B84E29',
          500: '#D9633B',
          400: '#E8815E',
          100: '#FBECE6',
          50: '#FDF5F2'
        },
        cream: {
          50: '#FAF8F5',
          100: '#F3EFEA',
          200: '#E6E0D6',
          300: '#D8CFBF'
        },
        charcoal: {
          950: '#0F1213',
          900: '#191C1E',
          800: '#2B3033',
          700: '#42494D',
          500: '#6D777C',
          300: '#A0A9AE',
          100: '#E3E7E9'
        },
        sand: {
          100: '#F5F2EB'
        },
        // Semantic aliases
        primary: {
          DEFAULT: '#122C23', // forest-900
          dark: '#0A1C16',    // forest-950
          light: '#E4ECE7'   // sage-100
        },
        accent: {
          DEFAULT: '#D9633B', // clay-500
          light: '#FBECE6'   // clay-100
        },
        warning: {
          DEFAULT: '#C27803',
          light: '#FEF5E7'
        },
        danger: {
          DEFAULT: '#B93838',
          light: '#FCE8E8'
        },
        background: '#FAF8F5', // cream-50
        card: '#FFFFFF',
        surface: '#F3EFEA',    // cream-100
        border: '#E6E0D6',     // cream-200
        input: '#F5F2EB',      // sand-100
        text: {
          DEFAULT: '#191C1E',  // charcoal-900
          muted: '#6D777C',    // charcoal-500
          light: '#A0A9AE'     // charcoal-300
        }
      }
    }
  },
  darkMode: "class",
  plugins: []
};
