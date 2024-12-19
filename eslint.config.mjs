import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      'server.js',
      'src/App.test.js',
      'src/__tests__/**/*.js',
      'cypress.config.js',
      'cypress/e2e/**',
      'src/Services/**',
      'build/**',
    ],
  },
  { settings: { react: { version: 'detect' } } },
  { rules: { 'react/prop-types': 0 } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
