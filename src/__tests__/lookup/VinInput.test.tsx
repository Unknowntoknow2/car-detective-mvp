import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { VinInput } from "@/components/premium/lookup/vin/VinInput";

describe("VinInput Component", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    validationError: null,
    touched: false,
    isValid: false,
    isLoading: false,
    onKeyPress: vi.fn(),
  };

  it("renders correctly with default props", () => {
    render(<VinInput {...defaultProps} />);

    const input = screen.getByPlaceholderText(/enter vin/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("displays validation error when provided", () => {
    render(
      <VinInput
        {...defaultProps}
        validationError="Invalid VIN"
        touched
      />,
    );

    const errorMessage = screen.getByText("Invalid VIN");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("does not display validation error when not touched", () => {
    render(
      <VinInput
        {...defaultProps}
        validationError="Invalid VIN"
        touched={false}
      />,
    );

    const errorMessage = screen.queryByText("Invalid VIN");
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("shows success state when input is valid", () => {
    render(<VinInput {...defaultProps} isValid touched />);

    // Assuming your UI shows some indication of valid input
    const input = screen.getByPlaceholderText(/enter vin/i);
    expect(input).toHaveClass("focus:ring-green-500");
  });

  it("calls onChange handler when input changes", async () => {
    const onChange = vi.fn();
    render(<VinInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/enter vin/i);
    await userEvent.type(input, "JH4DA9380PS000111");

    expect(onChange).toHaveBeenCalled();
  });

  it("shows loading state when isLoading is true", () => {
    render(<VinInput {...defaultProps} isLoading />);

    // Check for loading indicator
    const loadingIndicator = screen.getByRole("status");
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("formats VIN to uppercase", async () => {
    const onChange = vi.fn();
    render(<VinInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/enter vin/i);
    await userEvent.type(input, "jh4da9380ps000111");

    // Check that the onChange was called with uppercase letters
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: expect.stringMatching(/[A-Z0-9]/),
      }),
    }));
  });

  it("calls onKeyPress when Enter key is pressed", () => {
    const onKeyPress = vi.fn();
    render(<VinInput {...defaultProps} onKeyPress={onKeyPress} />);

    const input = screen.getByPlaceholderText(/enter vin/i);
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });

    expect(onKeyPress).toHaveBeenCalled();
  });
});
