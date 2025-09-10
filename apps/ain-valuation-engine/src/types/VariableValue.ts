// Stub for VariableValue
export type VariablePrimitive = string | number | boolean | null | undefined | Date;
export type VariableValue = {
  Variable?: string;
  Value?: string | number | boolean | null | undefined | Date | true;
  [key: string]: VariablePrimitive | VariablePrimitive[] | undefined;
};

// Example value object for Google-level build hygiene
export const DefaultVariableValue = null as unknown as VariableValue;

export interface TypedVariable<T = VariableValue> {
  key: string;
  value: T;
  source?: 'user' | 'api' | 'derived';
  verified?: boolean;
}
