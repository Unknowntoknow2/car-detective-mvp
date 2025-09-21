
import React from "react";
import { AuthTestPanel } from "@/components/admin/testing/AuthTestPanel";

export default function AdminPage() {
  // Provide the required props for AuthTestPanel
  const authTestProps = {
    results: [],
    isRunning: false,
    runTests: async () => {
    },
  };

  return (
    <div>
      {/* Pass required props to AuthTestPanel */}
      <AuthTestPanel
        results={authTestProps.results}
        isRunning={authTestProps.isRunning}
        runTests={authTestProps.runTests}
      />
    </div>
  );
}
