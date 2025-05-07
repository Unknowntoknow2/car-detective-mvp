
import React from 'react';

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <p className="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
      
      <form className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Send Reset Link
        </button>
      </form>
      
      <div className="mt-4">
        <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
