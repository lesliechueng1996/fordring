/** @type {import('tailwindcss').Config} */

const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, '{app,components}/**/*!(*.stories|*.spec).{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        label: 'rgb(var(--label-color))',
        'label-colorful': 'rgb(var(--label-colorful-color))',
        'label-colorful-sub': 'rgb(var(--label-colorful-color-sub))',
        'content-main': 'rgb(var(--content-main-color))',
        'content-sub': 'rgb(var(--content-sub-color))',
        background: 'rgb(var(--background-color))',
        'deep-background': 'rgb(var(--deep-background-color))',
      },
    },
  },
  plugins: [],
};
