
import React from 'react';
import { AuditChecklist } from '@/components/audit/AuditChecklist';
import { UserAuth } from '@/components/auth/UserAuth';

export default function AuditPage() {
  return (
    <div>
      <UserAuth>
        <AuditChecklist />
      </UserAuth>
    </div>
  );
}
