
import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import { Toaster } from 'sonner';

function App() {
  const routeElements = useRoutes(routes);
  
  return (
    <>
      <Toaster position="top-center" richColors />
      {routeElements}
    </>
  );
}

export default App;
