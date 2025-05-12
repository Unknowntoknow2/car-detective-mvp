
import { Info } from 'lucide-react';

export function VinInfoMessage() {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-500 mt-1">
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-slate-400" />
      <div>
        <p>The VIN is a 17-character code that can be found:</p>
        <ul className="list-disc list-inside ml-1 mt-1 space-y-0.5">
          <li>On the driver's side dashboard near the windshield</li>
          <li>Inside the driver's door jamb</li>
          <li>On your vehicle registration or insurance documents</li>
        </ul>
      </div>
    </div>
  );
}
