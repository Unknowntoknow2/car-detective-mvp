
import React from 'react';

interface CompletionHeaderProps {
  title: string;
}

export const CompletionHeader: React.FC<CompletionHeaderProps> = ({ title }) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default CompletionHeader;
