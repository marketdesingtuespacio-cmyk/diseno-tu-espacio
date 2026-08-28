/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#FFFFFF",
          black: "#000000",
          charcoal: "#121212",
          surface: "#F9F9F9",
          surfaceHover: "#F3F3F3",
          border: "#E5E5E5",
          muted: "#757575",
          accent: "#222222"
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 40px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
