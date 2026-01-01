/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Changi Brand Colors
        'changi-navy': '#0f1133',
        'changi-purple': '#693874',
        'changi-cream': '#f3efe9',
        'changi-red': '#902437',
        'changi-gray': '#5b5b5b',
        
        // Green Tier Colors
        'carbon-leaf': '#2D8B4E',
        'carbon-mint': '#4ECDC4',
        'carbon-sage': '#87A878',
        'carbon-forest': '#1B4332',
        'carbon-lime': '#B7E4C7',
      },
      fontFamily: {
        sans: ['var(--font-lato)', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

