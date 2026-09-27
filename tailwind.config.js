const tokens = require('./tailwind.tokens.js');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: {
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg':          ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg':         ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile':  ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-md':         ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg':             ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':             ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md':            ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm':            ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      borderRadius: {
        DEFAULT: '1rem',
        sm:      '0.5rem',
        md:      '1.5rem',
        lg:      '2rem',
        xl:      '3rem',
        full:    '9999px',
      },
      spacing: {
        'unit':                       '8px',
        'gutter':                     '24px',
        'section-gap':                '48px',
        'container-padding-mobile':   '24px',
        'container-padding-desktop':  '64px',
      },
      boxShadow: {
        'card':       '0px 10px 30px rgb(var(--color-shadow) / 0.05)',
        'card-md':    '0px 10px 30px rgb(var(--color-shadow) / 0.07)',
        'card-hover': '0px 20px 40px rgb(var(--color-shadow) / 0.1)',
        'modal':      '0px 20px 60px rgb(var(--color-shadow) / 0.15)',
        'primary':    '0px 4px 14px rgb(var(--color-primary) / 0.3)',
        'primary-lg': '0px 8px 24px rgb(var(--color-primary) / 0.28)',
      },
    },
  },
  plugins: [],
};
