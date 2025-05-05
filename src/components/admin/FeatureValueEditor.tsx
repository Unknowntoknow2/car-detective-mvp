
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Save, Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Feature {
  id: string;
  name: string;
  value_impact: number;
  category: string;
}

export function FeatureValueEditor() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: '',
    value_impact: 0,
    category: 'premium',
  });
  const [editingFeature, setEditingFeature] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (err) {
      console.error('Error fetching features:', err);
      toast.error('Failed to load features');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (id: string, value: string) => {
    // Update the editing state for this specific feature
    setEditingFeature({
      ...editingFeature,
      [id]: Number(value),
    });
  };

  const saveFeatureValue = async (feature: Feature) => {
    if (!(feature.id in editingFeature)) return;
    
    try {
      setIsSubmitting(true);
      const newValue = editingFeature[feature.id];
      
      const { error } = await supabase
        .from('features')
        .update({ value_impact: newValue })
        .eq('id', feature.id);

      if (error) throw error;
      
      // Update the local state
      setFeatures(features.map(f => 
        f.id === feature.id ? { ...f, value_impact: newValue } : f
      ));
      
      // Clear this feature from editing state
      const newEditingFeature = { ...editingFeature };
      delete newEditingFeature[feature.id];
      setEditingFeature(newEditingFeature);
      
      toast.success(`Updated value for ${feature.name}`);
    } catch (err) {
      console.error('Error updating feature:', err);
      toast.error('Failed to update feature value');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewFeature = async () => {
    if (!newFeature.name.trim()) {
      toast.error('Feature name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('features')
        .insert({
          name: newFeature.name.trim(),
          value_impact: newFeature.value_impact,
          category: newFeature.category.trim() || 'premium',
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add the new feature to the list
      setFeatures([...features, data]);
      
      // Reset the new feature form
      setNewFeature({
        name: '',
        value_impact: 0,
        category: 'premium',
      });
      
      toast.success(`Added new feature: ${data.name}`);
    } catch (err) {
      console.error('Error adding feature:', err);
      toast.error('Failed to add new feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFeature = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the feature "${name}"?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setFeatures(features.filter(f => f.id !== id));
      
      toast.success(`Deleted feature: ${name}`);
    } catch (err) {
      console.error('Error deleting feature:', err);
      toast.error('Failed to delete feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feature Value Calibration</h2>
      <p className="mb-6 text-muted-foreground">
        Adjust the dollar value impact of premium features on vehicle valuation.
      </p>

      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Add New Feature</h3>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <Input
              placeholder="Feature name"
              value={newFeature.name}
              onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-3">
            <Input
              type="number"
              placeholder="Value ($)"
              value={newFeature.value_impact}
              onChange={(e) => setNewFeature({...newFeature, value_impact: Number(e.target.value)})}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-3">
            <Input
              placeholder="Category"
              value={newFeature.category}
              onChange={(e) => setNewFeature({...newFeature, category: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-1">
            <Button 
              onClick={addNewFeature} 
              disabled={isSubmitting || !newFeature.name.trim()}
              className="w-full"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Feature Name</TableHead>
              <TableHead className="w-[20%]">Category</TableHead>
              <TableHead className="w-[25%]">Value Impact ($)</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No features found. Add your first feature above.
                </TableCell>
              </TableRow>
            ) : (
              features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell>{feature.category}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={feature.value_impact}
                      onChange={(e) => handleValueChange(feature.id, e.target.value)}
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveFeatureValue(feature)}
                        disabled={isSubmitting || !(feature.id in editingFeature)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFeature(feature.id, feature.name)}
                        disabled={isSubmitting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
