const refreshData = useCallback(async (forceRefresh = false) => {
  try {
    console.log("Refreshing vehicle data from Supabase...");
    setIsLoading(true);
    
    if (forceRefresh) {
      clearCache();
    }
    
    // Fetch makes and models directly from Supabase
    const { data: makesData, error: makesError } = await supabase
      .from('makes')
      .select('*');

    const { data: modelsData, error: modelsError } = await supabase
      .from('models')
      .select('*');

    if (makesError || modelsError) {
      throw new Error('Error fetching makes/models from Supabase');
    }

    if (!makesData || makesData.length === 0) {
      throw new Error("Supabase returned 0 makes");
    }

    setMakes(makesData);
    setModels(modelsData || []);
    buildModelsByMake(modelsData || []);
    saveToCache(makesData, modelsData || []);
    
    return { success: true, makeCount: makesData.length, modelCount: modelsData?.length || 0 };
  } catch (err) {
    console.error('Error refreshing vehicle data from Supabase:', err);
    toast.error('Failed to load vehicle data. Using cached or fallback data.');
    return { success: false, error: err };
  } finally {
    setIsLoading(false);
  }
}, [buildModelsByMake]);
