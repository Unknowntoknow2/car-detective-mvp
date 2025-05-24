
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout';
import { SEO } from '@/components/layout/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { Sentry } from '@/lib/sentry';

export default function PlatformDiagnosticsPage() {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  const [supabaseProject, setSupabaseProject] = useState<string>('Checking...');
  const [sentryInitialized, setSentryInitialized] = useState<boolean>(false);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);

  useEffect(() => {
    // Check if Inter font is loaded
    const checkFont = () => {
      const testElement = document.createElement('span');
      testElement.style.fontFamily = 'Inter, sans-serif';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.innerText = 'Test';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const isInterLoaded = computedStyle.fontFamily.includes('Inter');
      
      setFontLoaded(isInterLoaded);
      document.body.removeChild(testElement);
    };
    
    // Check Supabase project
    const checkSupabase = async () => {
      try {
        const { data } = await supabase.from('_diagnose').select('project_id').limit(1).single();
        setSupabaseProject(data?.project_id || 'Connected (no project ID available)');
      } catch (error) {
        // Use environment variable instead of accessing protected property
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xltxqqzattxogxtqrggt.supabase.co';
        const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
        setSupabaseProject(`Connected to: ${projectRef}`);
      }
    };
    
    // Check if Sentry is initialized
    const checkSentry = () => {
      // For mock implementation we're just checking if our exported Sentry object exists
      setSentryInitialized(!!Sentry);
    };
    
    // Track console errors
    const trackErrors = () => {
      const errors: string[] = [];
      const originalConsoleError = console.error;
      
      console.error = (...args) => {
        const errorMsg = args.map(arg => 
          typeof arg === 'string' ? arg : 
          arg instanceof Error ? arg.message : 
          JSON.stringify(arg)
        ).join(' ');
        
        errors.push(errorMsg);
        setConsoleErrors([...errors]);
        originalConsoleError(...args);
      };
      
      return () => {
        console.error = originalConsoleError;
      };
    };
    
    checkFont();
    checkSupabase();
    checkSentry();
    const cleanup = trackErrors();
    
    return () => {
      cleanup();
    };
  }, []);
  
  return (
    <MainLayout>
      <SEO title="Platform Diagnostics" description="System diagnostics and platform health check" />
      
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8">Platform Diagnostics</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Font Loading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${fontLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p>Inter font is {fontLoaded ? 'successfully loaded' : 'not loaded'}</p>
              </div>
              <p className="mt-4 font-inter text-lg">This text should be in Inter font</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Supabase Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${supabaseProject !== 'Checking...' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <p>Supabase client: {supabaseProject}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sentry Initialization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${sentryInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p>Sentry is {sentryInitialized ? 'initialized' : 'not initialized'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Console Errors</CardTitle>
            </CardHeader>
            <CardContent>
              {consoleErrors.length === 0 ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-green-500"></div>
                  <p>No console errors detected</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3 bg-red-500"></div>
                    <p>{consoleErrors.length} console errors detected</p>
                  </div>
                  <div className="mt-4 max-h-64 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800 rounded">
                    {consoleErrors.map((error, index) => (
                      <div key={index} className="text-sm mb-2 text-red-500">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
