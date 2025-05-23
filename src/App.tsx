
import React from 'react';
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom';
import routes from './router';
import { Toaster } from 'sonner';

function AppRoutes() {
  const routeElements = useRoutes(routes);
  return routeElements;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
