
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
  
  // Testing library globals - define complete interface
  var screen: {
    getByText: typeof testingLibraryScreen.getByText;
    getByRole: typeof testingLibraryScreen.getByRole;
    getByLabelText: typeof testingLibraryScreen.getByLabelText;
    getByPlaceholderText: typeof testingLibraryScreen.getByPlaceholderText;
    getByAltText: typeof testingLibraryScreen.getByAltText;
    getByDisplayValue: typeof testingLibraryScreen.getByDisplayValue;
    getByTestId: typeof testingLibraryScreen.getByTestId;
    getByTitle: typeof testingLibraryScreen.getByTitle;
    queryByText: typeof testingLibraryScreen.queryByText;
    queryByRole: typeof testingLibraryScreen.queryByRole;
    queryByLabelText: typeof testingLibraryScreen.queryByLabelText;
    queryByPlaceholderText: typeof testingLibraryScreen.queryByPlaceholderText;
    queryByAltText: typeof testingLibraryScreen.queryByAltText;
    queryByDisplayValue: typeof testingLibraryScreen.queryByDisplayValue;
    queryByTestId: typeof testingLibraryScreen.queryByTestId;
    queryByTitle: typeof testingLibraryScreen.queryByTitle;
    findByText: typeof testingLibraryScreen.findByText;
    findByRole: typeof testingLibraryScreen.findByRole;
    findByLabelText: typeof testingLibraryScreen.findByLabelText;
    findByPlaceholderText: typeof testingLibraryScreen.findByPlaceholderText;
    findByAltText: typeof testingLibraryScreen.findByAltText;
    findByDisplayValue: typeof testingLibraryScreen.findByDisplayValue;
    findByTestId: typeof testingLibraryScreen.findByTestId;
    findByTitle: typeof testingLibraryScreen.findByTitle;
    getAllByText: typeof testingLibraryScreen.getAllByText;
    getAllByRole: typeof testingLibraryScreen.getAllByRole;
    getAllByLabelText: typeof testingLibraryScreen.getAllByLabelText;
    getAllByPlaceholderText: typeof testingLibraryScreen.getAllByPlaceholderText;
    getAllByAltText: typeof testingLibraryScreen.getAllByAltText;
    getAllByDisplayValue: typeof testingLibraryScreen.getAllByDisplayValue;
    getAllByTestId: typeof testingLibraryScreen.getAllByTestId;
    getAllByTitle: typeof testingLibraryScreen.getAllByTitle;
    queryAllByText: typeof testingLibraryScreen.queryAllByText;
    queryAllByRole: typeof testingLibraryScreen.queryAllByRole;
    queryAllByLabelText: typeof testingLibraryScreen.queryAllByLabelText;
    queryAllByPlaceholderText: typeof testingLibraryScreen.queryAllByPlaceholderText;
    queryAllByAltText: typeof testingLibraryScreen.queryAllByAltText;
    queryAllByDisplayValue: typeof testingLibraryScreen.queryAllByDisplayValue;
    queryAllByTestId: typeof testingLibraryScreen.queryAllByTestId;
    queryAllByTitle: typeof testingLibraryScreen.queryAllByTitle;
    findAllByText: typeof testingLibraryScreen.findAllByText;
    findAllByRole: typeof testingLibraryScreen.findAllByRole;
    findAllByLabelText: typeof testingLibraryScreen.findAllByLabelText;
    findAllByPlaceholderText: typeof testingLibraryScreen.findAllByPlaceholderText;
    findAllByAltText: typeof testingLibraryScreen.findAllByAltText;
    findAllByDisplayValue: typeof testingLibraryScreen.findAllByDisplayValue;
    findAllByTestId: typeof testingLibraryScreen.findAllByTestId;
    findAllByTitle: typeof testingLibraryScreen.findAllByTitle;
    debug: typeof testingLibraryScreen.debug;
    logTestingPlaygroundURL: typeof testingLibraryScreen.logTestingPlaygroundURL;
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
