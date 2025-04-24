
import { DesignCard } from '@/components/ui/design-system';
import { FileBarChart, History, FileLineChart, BadgeCheck } from 'lucide-react';

export function PremiumCard() {
  return (
    <>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-2xl transform -rotate-3 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark/20 to-transparent rounded-2xl transform rotate-3 z-0"></div>
      <DesignCard 
        variant="glass" 
        className="relative z-10 shadow-xl border-white/30 bg-white/80"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <FileBarChart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Premium Report</h3>
              <p className="text-xs text-text-secondary">CARFAX® Integration</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
            +25% accuracy
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-dark/50 border border-border/50">
              <h4 className="text-sm font-medium mb-1">Estimated Value</h4>
              <p className="text-2xl font-bold text-primary">$24,350</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-dark/50 border border-border/50">
              <h4 className="text-sm font-medium mb-1">Confidence</h4>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">95%</p>
                <BadgeCheck className="h-5 w-5 text-success" />
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-border/50 bg-gradient-card">
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <History className="h-4 w-4 mr-2 text-primary" />
              CARFAX® History
            </h4>
            <div className="space-y-2">
              <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-primary rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>3 Previous Owners</span>
                <span>No Accidents</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-border/50 bg-gradient-card">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FileLineChart className="h-4 w-4 mr-2 text-primary" />
              Market Position
            </h4>
            <div className="h-24 bg-surface-dark/30 rounded-lg flex items-end p-2">
              {[30, 45, 80, 65, 90, 75, 85].map((height, i) => (
                <div 
                  key={i}
                  className="h-full flex-1 flex items-end mx-0.5"
                >
                  <div 
                    className={`w-full rounded-t-sm ${i === 4 ? 'bg-primary' : 'bg-border-dark/80'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesignCard>
    </>
  );
}
