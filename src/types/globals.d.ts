
import type { vi } from 'vitest';

declare global {
  var describe: typeof import('vitest').describe;
  var test: typeof import('vitest').test;
  var expect: typeof import('vitest').expect;
  var beforeEach: typeof import('vitest').beforeEach;
  var beforeAll: typeof import('vitest').beforeAll;
  var afterAll: typeof import('vitest').afterAll;
  var vi: typeof import('vitest').vi;
  var jest: {
    fn: typeof vi.fn;
    mock: typeof vi.mock;
    clearAllMocks: typeof vi.clearAllMocks;
    resetAllMocks: typeof vi.resetAllMocks;
    restoreAllMocks: typeof vi.restoreAllMocks;
    spyOn: typeof vi.spyOn;
  };

  namespace jest {
    interface Mock extends ReturnType<typeof vi.fn> {}
  }
}

export {};
