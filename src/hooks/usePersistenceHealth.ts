import { useState, useEffect } from 'react';
import { checkPersistenceHealth, type PersistenceHealth } from '@/services/persistence/persistenceMonitor';

export const usePersistenceHealth = (intervalMs: number = 30000) => {
  const [health, setHealth] = useState<PersistenceHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const healthData = await checkPersistenceHealth();
      setHealth(healthData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check persistence health';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshHealth();
    
    // Set up periodic health checks
    const interval = setInterval(refreshHealth, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);

  return {
    health,
    loading,
    error,
    refreshHealth
  };
};