
// src/test-setup.ts
import { screen, fireEvent, waitFor, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest";

// Assign Testing Library globals
(globalThis as any).screen = screen;
(globalThis as any).fireEvent = fireEvent;
(globalThis as any).waitFor = waitFor;
(globalThis as any).render = render;

// Assign Vitest globals
(globalThis as any).describe = describe;
(globalThis as any).it = it;
(globalThis as any).test = test;
(globalThis as any).expect = expect;
(globalThis as any).beforeEach = beforeEach;
(globalThis as any).afterEach = afterEach;
(globalThis as any).beforeAll = beforeAll;
(globalThis as any).afterAll = afterAll;
(globalThis as any).vi = vi;

// Jest compatibility for legacy tests
(globalThis as any).jest = vi;
