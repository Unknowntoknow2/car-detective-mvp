
import { RulesEngineInput, AdjustmentBreakdown } from './types';

// Define the Rule type locally if it's missing from the types file
interface Rule {
  name: string;
  description: string;
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown;
}

export class RulesEngine {
  private rules: Rule[];
  
  constructor(rules: Rule[]) {
    this.rules = rules;
  }
  
  // Run all rules and return the results
  public evaluate(input: RulesEngineInput): AdjustmentBreakdown[] {
    return this.rules.map(rule => rule.calculate(input));
  }
  
  // Add a new rule to the engine
  public addRule(rule: Rule): void {
    this.rules.push(rule);
  }
  
  // Get all rules
  public getRules(): Rule[] {
    return this.rules;
  }
}
