
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
  
  // Testing library globals with complete interface
  var screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    getByLabelText: (text: string | RegExp) => HTMLElement;
    getByTestId: (text: string) => HTMLElement;
    getByDisplayValue: (text: string | RegExp) => HTMLElement;
    getByAltText: (text: string | RegExp) => HTMLElement;
    getByTitle: (text: string | RegExp) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp) => HTMLElement;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByLabelText: (text: string | RegExp) => HTMLElement | null;
    queryByTestId: (text: string) => HTMLElement | null;
    queryByDisplayValue: (text: string | RegExp) => HTMLElement | null;
    queryByAltText: (text: string | RegExp) => HTMLElement | null;
    queryByTitle: (text: string | RegExp) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp) => HTMLElement | null;
    findByText: (text: string | RegExp) => Promise<HTMLElement>;
    findByRole: (role: string, options?: any) => Promise<HTMLElement>;
    findByLabelText: (text: string | RegExp) => Promise<HTMLElement>;
    findByTestId: (text: string) => Promise<HTMLElement>;
    findByDisplayValue: (text: string | RegExp) => Promise<HTMLElement>;
    findByAltText: (text: string | RegExp) => Promise<HTMLElement>;
    findByTitle: (text: string | RegExp) => Promise<HTMLElement>;
    findByPlaceholderText: (text: string | RegExp) => Promise<HTMLElement>;
    getAllByText: (text: string | RegExp) => HTMLElement[];
    getAllByRole: (role: string, options?: any) => HTMLElement[];
    getAllByLabelText: (text: string | RegExp) => HTMLElement[];
    getAllByTestId: (text: string) => HTMLElement[];
    getAllByDisplayValue: (text: string | RegExp) => HTMLElement[];
    getAllByAltText: (text: string | RegExp) => HTMLElement[];
    getAllByTitle: (text: string | RegExp) => HTMLElement[];
    getAllByPlaceholderText: (text: string | RegExp) => HTMLElement[];
    queryAllByText: (text: string | RegExp) => HTMLElement[];
    queryAllByRole: (role: string, options?: any) => HTMLElement[];
    queryAllByLabelText: (text: string | RegExp) => HTMLElement[];
    queryAllByTestId: (text: string) => HTMLElement[];
    queryAllByDisplayValue: (text: string | RegExp) => HTMLElement[];
    queryAllByAltText: (text: string | RegExp) => HTMLElement[];
    queryAllByTitle: (text: string | RegExp) => HTMLElement[];
    queryAllByPlaceholderText: (text: string | RegExp) => HTMLElement[];
    findAllByText: (text: string | RegExp) => Promise<HTMLElement[]>;
    findAllByRole: (role: string, options?: any) => Promise<HTMLElement[]>;
    findAllByLabelText: (text: string | RegExp) => Promise<HTMLElement[]>;
    findAllByTestId: (text: string) => Promise<HTMLElement[]>;
    findAllByDisplayValue: (text: string | RegExp) => Promise<HTMLElement[]>;
    findAllByAltText: (text: string | RegExp) => Promise<HTMLElement[]>;
    findAllByTitle: (text: string | RegExp) => Promise<HTMLElement[]>;
    findAllByPlaceholderText: (text: string | RegExp) => Promise<HTMLElement[]>;
  };
  
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
