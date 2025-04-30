
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { CarFront, Search, FileText, Loader2, Sliders, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefObject } from 'react';
import PremiumValuationSection from './PremiumValuationSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface ValuationFormProps {
  formRef: RefObject<HTMLDivElement>;
}

export function ValuationForm({ formRef }: ValuationFormProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [equipmentData, setEquipmentData] = useState({
    ids: [] as number[],
    multiplier: 1,
    valueAdd: 0
  });
  
  // Load equipment data from local storage
  useEffect(() => {
    const equipmentIds = localStorage.getItem('equipment_ids');
    const multiplier = localStorage.getItem('equipment_multiplier');
    const valueAdd = localStorage.getItem('equipment_value_add');
    
    if (equipmentIds) {
      setEquipmentData({
        ids: JSON.parse(equipmentIds),
        multiplier: multiplier ? parseFloat(multiplier) : 1,
        valueAdd: valueAdd ? parseInt(valueAdd) : 0
      });
    }
  }, []);
  
  return (
    <motion.section 
      ref={formRef} 
      id="premium-valuation" 
      className="py-12 md:py-20 px-4 bg-gradient-to-b from-surface to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/premium/condition')}
        >
          <Sliders className="h-4 w-4" />
          Enterprise Condition Evaluation
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/equipment')}
        >
          <Settings className="h-4 w-4" />
          Equipment & Packages
        </Button>
      </div>
      
      <PremiumValuationSection equipmentData={equipmentData} />
    </motion.section>
  );
}
