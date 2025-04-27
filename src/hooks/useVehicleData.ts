const getYearOptions = useCallback((startYearInput?: number): number[] => {
  const currentYear = new Date().getFullYear();
  const startYear = startYearInput && !isNaN(startYearInput) ? startYearInput : 1980;
  const endYear = currentYear + 1;
  const totalYears = endYear - startYear + 1;

  if (isNaN(totalYears) || totalYears < 1 || totalYears > 500) {
    console.error("Invalid year range calculated, using default fallback.");
    return [currentYear, currentYear - 1];
  }

  return Array.from({ length: totalYears }, (_, i) => endYear - i);
}, []);
