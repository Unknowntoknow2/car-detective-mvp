
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EquipmentSelector } from '@/components/valuation/equipment/EquipmentSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EquipmentOption {
  id: number;
  name: string;
  multiplier: number;
  value_add: number;
}

export default function EquipmentSelectionPage() {
  const navigate = useNavigate();
  const [selectedEquipment, setSelectedEquipment] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>([]);

  // Fetch equipment options to calculate combined multiplier
  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      const { data, error } = await supabase
        .from('equipment_options')
        .select('*');
      
      if (!error && data) {
        setEquipmentOptions(data);
      }
    };

    fetchEquipmentOptions();
  }, []);

  const handleSaveEquipment = () => {
    setIsSubmitting(true);
    
    try {
      // Calculate combined multiplier and value add
      const selectedOptions = equipmentOptions.filter(option => 
        selectedEquipment.includes(option.id)
      );
      
      const combinedMultiplier = selectedOptions.reduce(
        (total, option) => total * option.multiplier, 
        1
      );
      
      const totalValueAdd = selectedOptions.reduce(
        (total, option) => total + option.value_add, 
        0
      );
      
      // Store equipment info in local storage for the valuation process
      localStorage.setItem('equipment_ids', JSON.stringify(selectedEquipment));
      localStorage.setItem('equipment_multiplier', String(combinedMultiplier));
      localStorage.setItem('equipment_value_add', String(totalValueAdd));
      
      // Add equipment names for better context in the valuation
      const equipmentNames = selectedOptions.map(option => option.name);
      localStorage.setItem('equipment_names', JSON.stringify(equipmentNames));
      
      toast.success("Equipment options saved successfully");
      navigate('/premium');
    } catch (error) {
      console.error("Error saving equipment options:", error);
      toast.error("Failed to save equipment options");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/premium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Premium Valuation
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
            Equipment & Packages
          </h1>
          <p className="text-lg text-gray-600">
            Select all equipment and packages included with your vehicle for a more accurate valuation.
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border p-6 mb-8">
          <EquipmentSelector 
            selectedEquipment={selectedEquipment}
            onChange={setSelectedEquipment}
          />

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveEquipment}
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? 'Saving...' : 'Save Equipment Options'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
