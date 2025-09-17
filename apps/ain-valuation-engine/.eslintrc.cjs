module.exports = {
  root: false,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      env: { browser: true, node: true },
    },
    {
      files: [
        'tests/**/*',
        '**/*.test.ts',
        '**/*_e2e*.ts',
        '**/*audit*.ts',
        '**/*debug*.ts',
      ],
      env: { jest: true, node: true },
    },
  ],
  rules: {
    // keep defaults while we zero real TS errors; re-enable later
  },
};
