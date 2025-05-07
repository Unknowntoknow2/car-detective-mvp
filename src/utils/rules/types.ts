
export interface Rule {
  name: string;
  condition: any;
  consequence: any;
  priority?: number;
  description?: string;
}
