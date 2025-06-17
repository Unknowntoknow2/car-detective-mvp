
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>The page you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
