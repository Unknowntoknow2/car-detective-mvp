
// src/types/globals.d.ts
import type * as testingLibrary from "@testing-library/react";

declare global {
  // Makes screen, fireEvent, waitFor available globally with correct types
  var screen: typeof testingLibrary.screen;
  var fireEvent: typeof testingLibrary.fireEvent;
  var waitFor: typeof testingLibrary.waitFor;
}

export {};
