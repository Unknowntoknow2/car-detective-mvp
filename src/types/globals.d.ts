
import type { vi } from 'vitest';
import type { 
  screen as testingLibraryScreen, 
  fireEvent as testingLibraryFireEvent, 
  waitFor as testingLibraryWaitFor,
  render as testingLibraryRender
} from '@testing-library/react';

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
  
  // Testing library utilities - include all screen methods
  var screen: {
    getByText: typeof testingLibraryScreen.getByText;
    getByRole: typeof testingLibraryScreen.getByRole;
    getByLabelText: typeof testingLibraryScreen.getByLabelText;
    getByPlaceholderText: typeof testingLibraryScreen.getByPlaceholderText;
    getByDisplayValue: typeof testingLibraryScreen.getByDisplayValue;
    getByAltText: typeof testingLibraryScreen.getByAltText;
    getByTitle: typeof testingLibraryScreen.getByTitle;
    getByTestId: typeof testingLibraryScreen.getByTestId;
    getAllByText: typeof testingLibraryScreen.getAllByText;
    getAllByRole: typeof testingLibraryScreen.getAllByRole;
    getAllByLabelText: typeof testingLibraryScreen.getAllByLabelText;
    getAllByPlaceholderText: typeof testingLibraryScreen.getAllByPlaceholderText;
    getAllByDisplayValue: typeof testingLibraryScreen.getAllByDisplayValue;
    getAllByAltText: typeof testingLibraryScreen.getAllByAltText;
    getAllByTitle: typeof testingLibraryScreen.getAllByTitle;
    getAllByTestId: typeof testingLibraryScreen.getAllByTestId;
    queryByText: typeof testingLibraryScreen.queryByText;
    queryByRole: typeof testingLibraryScreen.queryByRole;
    queryByLabelText: typeof testingLibraryScreen.queryByLabelText;
    queryByPlaceholderText: typeof testingLibraryScreen.queryByPlaceholderText;
    queryByDisplayValue: typeof testingLibraryScreen.queryByDisplayValue;
    queryByAltText: typeof testingLibraryScreen.queryByAltText;
    queryByTitle: typeof testingLibraryScreen.queryByTitle;
    queryByTestId: typeof testingLibraryScreen.queryByTestId;
    queryAllByText: typeof testingLibraryScreen.queryAllByText;
    queryAllByRole: typeof testingLibraryScreen.queryAllByRole;
    queryAllByLabelText: typeof testingLibraryScreen.queryAllByLabelText;
    queryAllByPlaceholderText: typeof testingLibraryScreen.queryAllByPlaceholderText;
    queryAllByDisplayValue: typeof testingLibraryScreen.queryAllByDisplayValue;
    queryAllByAltText: typeof testingLibraryScreen.queryAllByAltText;
    queryAllByTitle: typeof testingLibraryScreen.queryAllByTitle;
    queryAllByTestId: typeof testingLibraryScreen.queryAllByTestId;
    findByText: typeof testingLibraryScreen.findByText;
    findByRole: typeof testingLibraryScreen.findByRole;
    findByLabelText: typeof testingLibraryScreen.findByLabelText;
    findByPlaceholderText: typeof testingLibraryScreen.findByPlaceholderText;
    findByDisplayValue: typeof testingLibraryScreen.findByDisplayValue;
    findByAltText: typeof testingLibraryScreen.findByAltText;
    findByTitle: typeof testingLibraryScreen.findByTitle;
    findByTestId: typeof testingLibraryScreen.findByTestId;
    findAllByText: typeof testingLibraryScreen.findAllByText;
    findAllByRole: typeof testingLibraryScreen.findAllByRole;
    findAllByLabelText: typeof testingLibraryScreen.findAllByLabelText;
    findAllByPlaceholderText: typeof testingLibraryScreen.findAllByPlaceholderText;
    findAllByDisplayValue: typeof testingLibraryScreen.findAllByDisplayValue;
    findAllByAltText: typeof testingLibraryScreen.findAllByAltText;
    findAllByTitle: typeof testingLibraryScreen.findAllByTitle;
    findAllByTestId: typeof testingLibraryScreen.findAllByTestId;
    debug: typeof testingLibraryScreen.debug;
    logTestingPlaygroundURL: typeof testingLibraryScreen.logTestingPlaygroundURL;
  };
  var fireEvent: typeof testingLibraryFireEvent;
  var waitFor: typeof testingLibraryWaitFor;
  var render: typeof testingLibraryRender;
  
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
