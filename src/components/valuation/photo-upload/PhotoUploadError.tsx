
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhotoUploadErrorProps {
  error: string | null;
}

export function PhotoUploadError({ error }: PhotoUploadErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
