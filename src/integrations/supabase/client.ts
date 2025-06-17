
export const supabase = {
  functions: {
    invoke: async (functionName: string, options: any) => {
      // Mock implementation
      return {
        data: { explanation: "Mock explanation" },
        error: null
      };
    }
  }
};
