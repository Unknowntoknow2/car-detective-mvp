

import type { vi } from 'vitest';
import type { screen as testingLibraryScreen, fireEvent as testingLibraryFireEvent, waitFor as testingLibraryWaitFor } from '@testing-library/react';

declare global {
  var describe: typeof import('vitest').describe;
  var test: typeof import('vitest').test;
  var it: typeof import('vitest').it;
  var expect: typeof import('vitest').expect;
  var beforeEach: typeof import('vitest').beforeEach;
  var beforeAll: typeof import('vitest').beforeAll;
  var afterAll: typeof import('vitest').afterAll;
  var afterEach: typeof import('vitest').afterEach;
  var vi: typeof import('vitest').vi;
  
  // Testing library utilities with all methods
  var screen: typeof testingLibraryScreen;
  var fireEvent: typeof testingLibraryFireEvent;
  var waitFor: typeof testingLibraryWaitFor;
  
  var jest: {
    fn: typeof vi.fn;
    mock: typeof vi.mock;
    clearAllMocks: typeof vi.clearAllMocks;
    resetAllMocks: typeof vi.resetAllMocks;
    restoreAllMocks: typeof vi.restoreAllMocks;
    spyOn: typeof vi.spyOn;
    Mock: typeof vi.Mock;
    createMockFromModule: typeof vi.mock;
    doMock: typeof vi.doMock;
    dontMock: typeof vi.dontMock;
    unmock: typeof vi.unmock;
    resetModules: typeof vi.resetModules;
    isolateModules: typeof vi.isolateModules;
  };

  namespace jest {
    interface Mock<T = any> extends ReturnType<typeof vi.fn<T>> {
      mockReturnValue: ReturnType<typeof vi.fn>['mockReturnValue'];
      mockResolvedValue: ReturnType<typeof vi.fn>['mockResolvedValue'];
      mockRejectedValue: ReturnType<typeof vi.fn>['mockRejectedValue'];
      mockImplementation: ReturnType<typeof vi.fn>['mockImplementation'];
    }
  }

  interface Window {
    IntersectionObserver: any;
    ResizeObserver: any;
  }
}

// Extend vitest expect with jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {
    toBeInTheDocument(): T;
    toHaveClass(className: string): T;
    toHaveTextContent(text: string | RegExp): T;
    toHaveAttribute(attr: string, value?: string): T;
    toBeDisabled(): T;
    toBeEmptyDOMElement(): T;
  }
}

export {};

