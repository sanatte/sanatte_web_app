/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'primary-dark': '#6D28D9',
        'primary-light': '#A78BFA',
        accent: '#10B981',
        'accent-dark': '#059669',
        danger: '#EF4444',
        'danger-dark': '#DC2626',
        warning: '#F59E0B',
        'sidebar-bg': '#F8F7FC',
        'sidebar-active': '#EDE9FE',
      }
    },
  },
  plugins: [],
}

