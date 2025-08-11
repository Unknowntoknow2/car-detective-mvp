// Jest setup file
// Add any global test configuration here

// Mock fetch for tests
global.fetch = require('node-fetch');

// Setup console warnings/errors handling
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes && args[0].includes('Warning:')) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    if (args[0]?.includes && args[0].includes('Warning:')) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
