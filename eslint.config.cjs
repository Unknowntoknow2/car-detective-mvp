/** @type {import('eslint').Linter.FlatConfig[]} */
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const unused = require('eslint-plugin-unused-imports');
const globals = require('globals');

module.exports = [
  { ignores: ['dist/**','node_modules/**','coverage/**','apps/**/dist/**','**/*.gen.*'] },

  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.eslint.json'], ecmaFeatures: { jsx: true } },
      // allow browser code + common globals seen in your codebase
      globals: { ...globals.browser, process: 'readonly', Buffer: 'readonly', React: 'readonly' }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'unused-imports': unused
    },
    rules: {
      // let unused-imports handle both imports & vars (it autofixes)
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      // Production console bans - critical for clean production builds
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
    },
  },

  // node-y scripts
  {
    files: ['src/scripts/**/*.{js,ts}'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: globals.node },
    rules: { 'no-undef': 'off' }
  },

  // tests (vitest globals: describe/it/expect/vi, etc.)
  {
    files: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}','src/**/__tests__/**/*.{ts,tsx,js,jsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.vitest } }
  }
];
