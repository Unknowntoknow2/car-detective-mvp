
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ValuationHistory } from './ValuationHistory';

export const DashboardRouter = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route index element={<ValuationHistory />} />
        <Route path="history" element={<ValuationHistory />} />
      </Routes>
    </div>
  );
};
