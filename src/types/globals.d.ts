import * as React from 'react';

// src/types/globals.d.ts
import type { BoundFunction, queries, Queries } from "@testing-library/dom";
import type { ReactTestingLibraryRenderOptions } from "@testing-library/react";
import type { vi } from "vitest";

// Define the proper screen type with all methods
interface Screen extends BoundFunction<Queries> {
  getByText: (text: string | RegExp) => HTMLElement;
  getByRole: (role: string, options?: any) => HTMLElement;
  getByLabelText: (text: string | RegExp) => HTMLElement;
  queryByText: (text: string | RegExp) => HTMLElement | null;
  findByText: (text: string | RegExp) => Promise<HTMLElement>;
  getAllByText: (text: string | RegExp) => HTMLElement[];
  queryAllByText: (text: string | RegExp) => HTMLElement[];
  findAllByText: (text: string | RegExp) => Promise<HTMLElement[]>;
  getByTestId: (testId: string) => HTMLElement;
  queryByTestId: (testId: string) => HTMLElement | null;
  findByTestId: (testId: string) => Promise<HTMLElement>;
  debug: (element?: HTMLElement) => void;
}

declare global {
  // Testing Library globals
  var screen: Screen;
  var fireEvent: {
    click: (element: HTMLElement) => void;
    change: (element: HTMLElement, options?: any) => void;
    submit: (element: HTMLElement) => void;
    [key: string]: any;
  };
  var waitFor: (callback: () => void | Promise<void>, options?: any) => Promise<void>;
  var render: (ui: React.ReactElement, options?: ReactTestingLibraryRenderOptions) => {
    container: HTMLElement;
    [key: string]: any;
  };
  
  // Vitest/Jest globals
  var describe: (name: string, fn: () => void) => void;
  var it: (name: string, fn: () => void | Promise<void>) => void;
  var test: (name: string, fn: () => void | Promise<void>) => void;
  var expect: any;
  var beforeEach: (fn: () => void | Promise<void>) => void;
  var afterEach: (fn: () => void | Promise<void>) => void;
  var beforeAll: (fn: () => void | Promise<void>) => void;
  var afterAll: (fn: () => void | Promise<void>) => void;
  var vi: typeof vi;
  
  // Jest compatibility
  var jest: {
    Mock: any;
    fn: typeof vi.fn;
    mock: typeof vi.mock;
    clearAllMocks: typeof vi.clearAllMocks;
    resetAllMocks: typeof vi.resetAllMocks;
    restoreAllMocks: typeof vi.restoreAllMocks;
  };
}

export {};
