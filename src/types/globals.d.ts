

import type { vi } from 'vitest';

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
  
  // Testing library globals - include all screen methods
  var screen: {
    getByText: (text: string | RegExp, options?: any) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: any) => HTMLElement;
    getByTestId: (testId: string, options?: any) => HTMLElement;
    getByDisplayValue: (value: string | RegExp, options?: any) => HTMLElement;
    getByAltText: (text: string | RegExp, options?: any) => HTMLElement;
    getByTitle: (title: string | RegExp, options?: any) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement;
    
    queryByText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByLabelText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByTestId: (testId: string, options?: any) => HTMLElement | null;
    queryByDisplayValue: (value: string | RegExp, options?: any) => HTMLElement | null;
    queryByAltText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByTitle: (title: string | RegExp, options?: any) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement | null;
    
    getAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByRole: (role: string, options?: any) => HTMLElement[];
    getAllByLabelText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByTestId: (testId: string, options?: any) => HTMLElement[];
    getAllByDisplayValue: (value: string | RegExp, options?: any) => HTMLElement[];
    getAllByAltText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByTitle: (title: string | RegExp, options?: any) => HTMLElement[];
    getAllByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement[];
    
    findByText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByRole: (role: string, options?: any) => Promise<HTMLElement>;
    findByLabelText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByTestId: (testId: string, options?: any) => Promise<HTMLElement>;
    findByDisplayValue: (value: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByAltText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByTitle: (title: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByPlaceholderText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    
    findAllByText: (text: string | RegExp, options?: any) => Promise<HTMLElement[]>;
    findAllByRole: (role: string, options?: any) => Promise<HTMLElement[]>;
    findAllByLabelText: (text: string | RegExp, options?: any) => Promise<HTMLElement[]>;
    findAllByTestId: (testId: string, options?: any) => Promise<HTMLElement[]>;
    findAllByDisplayValue: (value: string | RegExp, options?: any) => Promise<HTMLElement[]>;
    findAllByAltText: (text: string | RegExp, options?: any) => Promise<HTMLElement[]>;
    findAllByTitle: (title: string | RegExp, options?: any) => Promise<HTMLElement[]>;
    findAllByPlaceholderText: (text: string | RegExp, options?: any) => Promise<HTMLElement[]>;
  };
  
  var fireEvent: typeof import('@testing-library/react').fireEvent;
  var waitFor: typeof import('@testing-library/react').waitFor;
  
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

