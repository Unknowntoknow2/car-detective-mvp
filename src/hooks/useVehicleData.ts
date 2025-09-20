

export interface UseVehicleDataReturn {
  getYearOptions: (startYear?: number) => number[];
  getCurrentYear: () => number;
}

export function useVehicleData(): UseVehicleDataReturn {
  const getCurrentYear = () => new Date().getFullYear();

  const getYearOptions = (startYear: number = 1990): number[] => {
    const currentYear = getCurrentYear();
    const years: number[] = [];
    
    for (let year = currentYear + 1; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  };

  return {
    getYearOptions,
    getCurrentYear,
  };
}
