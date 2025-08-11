module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/*.test.ts", "**/*.test.js"],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.test.js'
  ],
  coverageReporters: ['text', 'lcov', 'html', 'xml'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
