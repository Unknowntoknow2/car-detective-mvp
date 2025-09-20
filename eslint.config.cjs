const tsParser = require('@typescript-eslint/parser');
const ts = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const imp = require('eslint-plugin-import');
const unused = require('eslint-plugin-unused-imports');
const globals = require('globals');

module.exports = [
  // Ignore paths (replaces .eslintignore)
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },

  // App code: TS/React in browser
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    plugins: {
      '@typescript-eslint': ts,
      react,
      'react-hooks': reactHooks,
      import: imp,
      'unused-imports': unused,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-undef': 'off',
      'no-case-declarations': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'unused-imports/no-unused-imports': 'error',
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Types: relax entirely
  {
    files: ['src/**/*.d.ts', 'src/**/types.ts'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Node scripts and config files
  {
    files: ['src/scripts/**/*.{js,ts}', 'scripts/**/*.{js,ts}', '*.config.{js,cjs,ts}', '.*rc.{js,cjs,ts}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-undef': 'off' },
  },
];
