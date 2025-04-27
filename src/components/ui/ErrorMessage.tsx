
import React from 'react';

interface ErrorMessageProps {
  message?: string;
  id?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, id }) => {
  if (!message) return null;
  
  return (
    <p 
      id={id} 
      className="text-sm font-medium text-destructive mt-1"
      role="alert"
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
