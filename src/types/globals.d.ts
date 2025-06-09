
// src/types/globals.d.ts
import type * as testingLibrary from "@testing-library/react";
import type { vi } from "vitest";

declare global {
  // Testing Library globals
  var screen: typeof testingLibrary.screen;
  var fireEvent: typeof testingLibrary.fireEvent;
  var waitFor: typeof testingLibrary.waitFor;
  var render: typeof testingLibrary.render;
  
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
  
  // Jest compatibility
  var jest: typeof vi;
}

export {};
