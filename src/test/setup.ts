
import '@testing-library/jest-dom/vitest';

// Add any global setup needed for tests here

// Extend the expect interface with Jest DOM matchers
declare global {
  namespace Vi {
    interface JestAssertion {
      toBeInTheDocument(): void;
      toHaveAttribute(attr: string, value?: string): void;
      toHaveTextContent(text: string | RegExp): void;
      toBeVisible(): void;
      toHaveClass(className: string): void;
    }
  }
}
