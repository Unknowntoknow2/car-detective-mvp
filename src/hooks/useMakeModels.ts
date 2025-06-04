<<<<<<< HEAD

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
=======
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface Make {
  id: string;
  make_name: string;
}

export interface Model {
  id: string;
  model_name: string;
  make_id: string;
}

export function useMakeModels() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  // Fetch all makes on hook initialization
  const fetchMakes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');

      if (error) throw error;

      console.log('✅ Fetched makes:', data?.length || 0);
      console.log('📋 Sample makes:', data?.slice(0, 5)?.map(m => `${m.make_name} (${m.id})`));
      setMakes(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching makes:', err);
      setError('Failed to load vehicle makes');
    } finally {
      setIsLoading(false);
    }
=======
  // Load makes on initial component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("makes")
          .select("id, make_name")
          .order("make_name");

        if (error) throw error;

        // Update the type handling to match the actual structure of the makes table
        // which appears to not have a logo_url column
        const typedData: VehicleMake[] = data
          ? data.map((make) => ({
            id: make.id,
            make_name: make.make_name,
            logo_url: null, // Set logo_url to null since it doesn't exist in the database
          }))
          : [];

        setMakes(typedData);
      } catch (err: any) {
        console.error("Error fetching makes:", err);
        setError("Failed to load vehicle makes");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMakes();
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }, []);

  // Fetch models by make ID
  const fetchModelsByMakeId = useCallback(async (makeId: string) => {
    console.log('🔄 fetchModelsByMakeId called with makeId:', makeId);
    
    // Only clear models if makeId is actually empty/undefined
    if (!makeId || makeId.trim() === '') {
      console.log('🧹 Clearing models - no makeId provided');
      setModels([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

<<<<<<< HEAD
      console.log('🔍 Fetching models for make_id:', makeId);
      console.log('🔍 Make ID type:', typeof makeId);
      console.log('🔍 Make ID length:', makeId.length);

      // First, let's verify the make exists
      const { data: makeCheck, error: makeError } = await supabase
        .from('makes')
        .select('id, make_name')
        .eq('id', makeId)
        .single();

      if (makeError) {
        console.error('❌ Make verification error:', makeError);
      } else {
        console.log('✅ Make found:', makeCheck);
      }

      // Check total count of models in the database
      const { count: totalModelsCount } = await supabase
        .from('models')
        .select('*', { count: 'exact', head: true });
      
      console.log('📊 Total models in database:', totalModelsCount);

      // Check if there are ANY models for ANY make
      const { data: sampleModels } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .limit(5);
      
      console.log('🔍 Sample models from database:', sampleModels);

      // Now fetch models with detailed logging
      const { data, error, count } = await supabase
        .from('models')
        .select('id, model_name, make_id', { count: 'exact' })
        .eq('make_id', makeId)
        .order('model_name');

      console.log('🔍 Raw query result:', { data, error, count });
      console.log('🔍 Query executed for make_id:', makeId);

      if (error) {
        console.error('❌ Models query error:', error);
        throw error;
      }

      console.log('✅ Fetched models for make:', data?.length || 0, 'models');
      console.log('📊 Total count from query:', count);
      
      if (data && data.length > 0) {
        console.log('📋 First 10 models found:', data.slice(0, 10).map(m => `${m.model_name} (${m.id})`));
        console.log('🎯 Setting models state with', data.length, 'models');
        setModels(data);
        console.log('✅ Models state updated successfully');
      } else {
        console.log('⚠️ No models found for this make');
        setModels([]);
      }

    } catch (err: any) {
      console.error('❌ Error fetching models:', err);
      setError('Failed to load vehicle models');
      setModels([]);
=======
      const { data, error } = await supabase
        .from("models")
        .select("id, make_id, model_name")
        .eq("make_id", makeId)
        .order("model_name");

      if (error) throw error;

      setModels(data || []);
      return data || [];
    } catch (err: any) {
      console.error("Error fetching models:", err);
      setError("Failed to load vehicle models");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch trims for a specific model
  const getTrimsByModelId = async (modelId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("model_trims")
        .select("id, model_id, trim_name, year, fuel_type, transmission")
        .eq("model_id", modelId)
        .order("trim_name");

      if (error) throw error;

      setTrims(data || []);
      return data || [];
    } catch (err: any) {
      console.error("Error fetching trims:", err);
      setError("Failed to load vehicle trims");
      return [];
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize makes on first load
  useEffect(() => {
    fetchMakes();
  }, [fetchMakes]);

  // Helper functions for finding records by ID
  const findMakeById = useCallback((makeId: string): Make | undefined => {
    return makes.find(make => make.id === makeId);
  }, [makes]);

  const findModelById = useCallback((modelId: string): Model | undefined => {
    return models.find(model => model.id === modelId);
  }, [models]);

  return {
    makes,
    models,
    isLoading,
    error,
    fetchMakes,
    fetchModelsByMakeId,
    findMakeById,
    findModelById,
  };
}
