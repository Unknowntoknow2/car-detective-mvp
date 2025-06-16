
import React from 'react';

interface ValuationReportHeaderProps {
  title: string;
  subtitle?: string;
}

export const ValuationReportHeader: React.FC<ValuationReportHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
};

export default ValuationReportHeader;
