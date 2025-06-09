
import React from 'react';

interface ToastProps {
  description: string;
  variant?: 'default' | 'destructive';
}

export function toast({ description, variant }: ToastProps) {
  console.log(`Toast [${variant || 'default'}]: ${description}`);
}
