/** @type {import('tailwindcss').Config} */

const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, '{app,components}/**/*!(*.stories|*.spec).{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

