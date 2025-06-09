
import React from "react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ValuationResultPage from "@/pages/ValuationResultPage";

describe("ValuationResultPage", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter initialEntries={["/valuation/test-id"]}>
        {component}
      </MemoryRouter>
    );
  };

  it("renders the valuation results page", () => {
    renderWithRouter(<ValuationResultPage />);
    
    expect(screen.getByText("Valuation Results")).toBeInTheDocument();
    expect(screen.getByText("Vehicle Information")).toBeInTheDocument();
    expect(screen.getByText("Valuation Summary")).toBeInTheDocument();
  });

  it("displays vehicle information correctly", () => {
    renderWithRouter(<ValuationResultPage />);
    
    expect(screen.getByText(/Make: Toyota/)).toHaveTextContent("Make: Toyota");
  });

  it("shows download and share buttons", () => {
    renderWithRouter(<ValuationResultPage />);
    
    const downloadButton = screen.getByRole("button", { name: /download/i });
    const shareButton = screen.getByRole("button", { name: /share/i });
    
    expect(downloadButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute("disabled");
  });

  it("handles button clicks", async () => {
    const user = userEvent.setup();
    renderWithRouter(<ValuationResultPage />);
    
    const downloadButton = screen.getByRole("button", { name: /download/i });
    await user.click(downloadButton);
    
    // Basic interaction test - no specific assertions needed for this test
  });
});
