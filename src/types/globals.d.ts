
// src/types/globals.d.ts
import type { screen, fireEvent, waitFor, render } from "@testing-library/react";
import type { vi } from "vitest";

declare global {
  // Testing Library globals - import and re-export the actual types
  var screen: typeof screen;
  var fireEvent: typeof fireEvent;
  var waitFor: typeof waitFor;
  var render: typeof render;
  
  // Vitest/Jest globals
  var describe: typeof import("vitest").describe;
  var it: typeof import("vitest").it;
  var test: typeof import("vitest").test;
  var expect: typeof import("vitest").expect;
  var beforeEach: typeof import("vitest").beforeEach;
  var afterEach: typeof import("vitest").afterEach;
  var beforeAll: typeof import("vitest").beforeAll;
  var afterAll: typeof import("vitest").afterAll;
  var vi: typeof import("vitest").vi;
  
  // Jest compatibility with proper Mock type
  var jest: typeof vi & {
    Mock: typeof vi.Mock;
    fn: typeof vi.fn;
    mock: typeof vi.mock;
    clearAllMocks: typeof vi.clearAllMocks;
    resetAllMocks: typeof vi.resetAllMocks;
    restoreAllMocks: typeof vi.restoreAllMocks;
  };
}

export {};
