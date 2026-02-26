export default {
  content: ['./index.html', './src/**/*.{tsx,ts,jsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)'],
        body: ['var(--font-body)'],
        code: ['var(--font-code)'],
      },
    },
  },
};
