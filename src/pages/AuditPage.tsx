
import React from "react";
import { AuditChecklist } from "@/components/audit/AuditChecklist";
import { UserAuth } from "@/components/auth/UserAuth";

const AuditPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">System Audit</h1>
      <div className="space-y-6">
        <AuditChecklist />
        <UserAuth />
      </div>
    </div>
  );
};

export default AuditPage;
