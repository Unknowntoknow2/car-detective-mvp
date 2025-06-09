
// src/test-setup.ts
import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

(globalThis as any).screen = screen;
(globalThis as any).fireEvent = fireEvent;
(globalThis as any).waitFor = waitFor;
