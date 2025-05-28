
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AINAssistantTrigger } from '@/components/chat/AINAssistantTrigger';
import routes from '@/router';

const Layout = () => {
  const renderRoutes = (routeConfigs: any[]) => {
    return routeConfigs.map((route, index) => {
      if (route.index) {
        return <Route key={index} index element={route.element} />;
      }
      
      if (route.children) {
        return (
          <Route key={index} path={route.path} element={route.element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      
      return <Route key={index} path={route.path} element={route.element} />;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {renderRoutes(routes)}
        </Routes>
      </main>
      <Footer />
      <AINAssistantTrigger />
    </div>
  );
};

export default Layout;
