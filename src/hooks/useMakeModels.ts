
export interface Make {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  makeId: string;
}

export function useMakeModels() {
  // Mock implementation for MVP
  const makes: Make[] = [
    { id: '1', name: 'Toyota' },
    { id: '2', name: 'Honda' },
    { id: '3', name: 'Ford' }
  ];

  const models: Model[] = [
    { id: '1', name: 'Camry', makeId: '1' },
    { id: '2', name: 'Corolla', makeId: '1' },
    { id: '3', name: 'Civic', makeId: '2' },
    { id: '4', name: 'Accord', makeId: '2' },
    { id: '5', name: 'F-150', makeId: '3' }
  ];

  return {
    makes,
    models,
    isLoading: false,
    error: null
  };
}
