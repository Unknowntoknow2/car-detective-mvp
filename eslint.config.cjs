/** @type {import('eslint').Linter.FlatConfig[]} */
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
  // Ignore build & vendor output
  { ignores: ['dist/**','node_modules/**','coverage/**','apps/**','**/*.gen.*'] },

  // TypeScript/React (typed linting)
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        // IMPORTANT: make project path resolution stable
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'import': require('eslint-plugin-import'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  // Node scripts (no type-aware rules needed)
  {
    files: ['src/scripts/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: globals.node,
    },
    rules: { 'no-undef': 'off' },
  },
];
