
// src/hooks/useMakeModels.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Make {
  id: string
  make_name: string
}

export interface Model {
  id: string
  model_name: string
  make_id: string
}

export interface Trim {
  id: string
  trim_name: string
  model_id: string
  year?: number
}

export function useMakeModels() {
  const [makes, setMakes] = useState<Make[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [trims, setTrims] = useState<Trim[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isLoadingTrims, setIsLoadingTrims] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMakes()
  }, [])

  const fetchMakes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name')

      if (error) throw error
      console.log('✅ useMakeModels: Fetched makes:', data?.length || 0, 'makes')
      setMakes(data || [])
    } catch (err) {
      console.error('❌ useMakeModels: Error fetching makes:', err)
      setError('Failed to load vehicle makes')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchModelsByMakeId = async (makeId: string) => {
    if (!makeId) {
      console.log('⚠️ useMakeModels: No makeId provided, clearing models')
      setModels([])
      return []
    }
    
    try {
      setIsLoadingModels(true)
      setError(null)
      console.log('🔍 useMakeModels: Fetching models for make_id:', makeId)
      
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .eq('make_id', makeId)
        .order('model_name')

      if (error) throw error
      
      console.log('📊 useMakeModels: Raw Supabase response for models:', {
        makeId,
        dataLength: data?.length || 0,
        sampleData: data?.slice(0, 3),
        fullData: data
      })
      
      setModels(data || [])
      console.log('✅ useMakeModels: setModels called with:', data?.length || 0, 'models')
      
      return data || []
    } catch (err) {
      console.error('❌ useMakeModels: Error fetching models:', err)
      setError('Failed to load vehicle models')
      return []
    } finally {
      setIsLoadingModels(false)
    }
  }

  const fetchTrimsByModelId = async (modelId: string) => {
    if (!modelId) {
      setTrims([])
      return []
    }
    try {
      setIsLoadingTrims(true)
      setError(null)
      const { data, error } = await supabase
        .from('model_trims')
        .select('id, trim_name, model_id, year')
        .eq('model_id', modelId)
        .order('trim_name')

      if (error) throw error
      setTrims(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching trims:', err)
      setError('Failed to load vehicle trims')
      return []
    } finally {
      setIsLoadingTrims(false)
    }
  }

  const getModelsByMakeId = (makeId: string) =>
    models.filter((model) => model.make_id === makeId)

  const getTrimsByModelId = (modelId: string) =>
    trims.filter((trim) => trim.model_id === modelId)

  const findMakeById = (id: string) =>
    makes.find((make) => make.id === id) || null

  const findModelById = (id: string) =>
    models.find((model) => model.id === id) || null

  return {
    makes,
    models,
    trims,
    isLoading,
    isLoadingModels,
    isLoadingTrims,
    error,
    fetchModelsByMakeId,
    fetchTrimsByModelId,
    getModelsByMakeId,
    getTrimsByModelId,
    findMakeById,
    findModelById,
  }
}
