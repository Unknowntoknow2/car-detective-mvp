
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
  var jest: {
    fn: typeof vi.fn;
    mock: typeof vi.mock;
    clearAllMocks: typeof vi.clearAllMocks;
    resetAllMocks: typeof vi.resetAllMocks;
    restoreAllMocks: typeof vi.restoreAllMocks;
    spyOn: typeof vi.spyOn;
    Mock: typeof vi.Mock;
  };

  namespace jest {
    interface Mock<T = any> extends ReturnType<typeof vi.fn<T>> {
      mockReturnValue: ReturnType<typeof vi.fn>['mockReturnValue'];
      mockResolvedValue: ReturnType<typeof vi.fn>['mockResolvedValue'];
      mockRejectedValue: ReturnType<typeof vi.fn>['mockRejectedValue'];
      mockImplementation: ReturnType<typeof vi.fn>['mockImplementation'];
    }
  }
}

export {};
