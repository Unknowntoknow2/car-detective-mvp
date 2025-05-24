
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import routes from './router';
import './App.css';

function App() {
  const content = useRoutes(routes);
  
  return (
    <HelmetProvider>
      {content}
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
