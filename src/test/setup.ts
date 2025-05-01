
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
      // Additional matchers from @testing-library/jest-dom if needed
      toHaveValue(value?: string | string[] | number | null): void;
      toBeChecked(): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeEmpty(): void;
      toBeEmptyDOMElement(): void;
      toBeInvalid(): void;
      toBeRequired(): void;
      toBeValid(): void;
      toContainElement(element: HTMLElement | null): void;
      toContainHTML(htmlText: string): void;
      toHaveFocus(): void;
      toHaveFormValues(expectedValues: Record<string, any>): void;
      toHaveStyle(css: Record<string, any>): void;
    }
  }
}
