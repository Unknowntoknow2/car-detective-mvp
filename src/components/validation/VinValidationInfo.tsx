
import React from 'react';

/**
 * Detailed VIN validation rules for form help text
 */
export const VinValidationInfo: React.FC = () => {
  return (
    <div className="text-sm text-gray-500">
      <p>A valid VIN:</p>
      <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
        <li>Contains exactly 17 characters</li>
        <li>Does not contain I, O, or Q</li>
        <li>Contains only letters A-H, J-N, P, R-Z and numbers</li>
      </ul>
    </div>
  );
};
