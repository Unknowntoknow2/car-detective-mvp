
import "@testing-library/jest-dom";
import { cleanup, screen, fireEvent, waitFor, render } from "@testing-library/react";
import { afterEach, vi, describe, test, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

// Make vitest globals available
globalThis.describe = describe;
globalThis.test = test;
globalThis.it = it;
globalThis.expect = expect;
globalThis.beforeEach = beforeEach;
globalThis.beforeAll = beforeAll;
globalThis.afterAll = afterAll;
globalThis.afterEach = afterEach;
globalThis.vi = vi;

// Make Testing Library utilities globally available with correct types
globalThis.screen = screen;
globalThis.fireEvent = fireEvent;
globalThis.waitFor = waitFor;
globalThis.render = render;

// Enhanced Jest compatibility with proper mock methods
globalThis.jest = {
  fn: vi.fn,
  mock: vi.mock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  spyOn: vi.spyOn,
  Mock: vi.Mock,
  createMockFromModule: vi.mock,
  doMock: vi.doMock,
  dontMock: vi.dontMock,
  unmock: vi.unmock,
  resetModules: vi.resetModules,
  isolateModules: vi.isolateModules,
} as any;

// Setup MSW server
const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Close server after all tests
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
