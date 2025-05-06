
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface RecentPaymentsCardProps {
  payments: {
    id: string;
    user_id: string;
    amount: number;
    created_at: string;
    status: string;
  }[];
}

export function RecentPaymentsCard({ payments }: RecentPaymentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Recent Payments</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex justify-between items-center border-b pb-2 last:border-0">
              <div>
                <p className="font-medium">${(payment.amount / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
