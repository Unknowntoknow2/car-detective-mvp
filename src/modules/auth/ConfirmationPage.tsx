
import React from 'react';
import { Link } from 'react-router-dom';

export interface ConfirmationPageProps {
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
}

const ConfirmationPage = ({ title, message, buttonText, buttonHref }: ConfirmationPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="mb-4 p-3 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-gray-600">{message}</p>
        </div>
        
        <Link
          to={buttonHref}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
