
import React from 'react';

export interface AuthTestPanelProps {
  results: any[];
  isRunning: boolean;
  runTests: () => void;
}

export const AuthTestPanel: React.FC<AuthTestPanelProps> = ({ 
  results, 
  isRunning, 
  runTests 
}) => {
  return (
    <div>
      <h2>Auth Test Panel</h2>
      <button onClick={runTests} disabled={isRunning}>
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>
      {results.length > 0 && (
        <ul>
          {results.map((result, i) => (
            <li key={i}>{JSON.stringify(result)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthTestPanel;
