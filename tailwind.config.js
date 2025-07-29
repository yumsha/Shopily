module.exports = {
  content: ["./**/*.html", "!./node_modules"],
  theme: {
    extend: {
      fontFamily: {
        poetsen: ['"Poetsen One"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif']
        
      },
      colors: {
        'biru1': '#213448',
        'biru2': '#003A76',
        'biru3': '#547792',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
