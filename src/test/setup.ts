
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextDecoder, TextEncoder } from 'util';

// Mock browser APIs not available in the test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch if needed
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    length: 0,
    key: (_index: number) => null
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock IntersectionObserver
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
    this.takeRecords = vi.fn(() => []);
  }
  
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
}

global.IntersectionObserver = IntersectionObserverMock;

// Mock ResizeObserver
class ResizeObserverMock {
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }
  
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Cleanup after each test
afterEach(() => {
  vi.resetAllMocks();
  localStorageMock.clear();
});
