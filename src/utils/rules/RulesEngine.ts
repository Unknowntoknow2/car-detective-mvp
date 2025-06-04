<<<<<<< HEAD

import { RulesEngineInput, AdjustmentBreakdown } from './types';

// Define the Rule type locally if it's missing from the types file
interface Rule {
  name: string;
  description: string;
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown;
=======
import { AdjustmentBreakdown, Rule, RulesEngineInput } from "./types";

export class RulesEngine {
  private rules: Rule[] = [];

  constructor(rules: Rule[] = []) {
    this.rules = rules;
  }

  addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  addRules(rules: Rule[]): void {
    this.rules = [...this.rules, ...rules];
  }

  evaluate(facts: RulesEngineInput): any {
    // Sort rules by priority if defined
    const sortedRules = [...this.rules].sort((a, b) => {
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      return priorityB - priorityA; // Higher priority first
    });

    // Apply rules in order
    let result: any = null;
    const auditTrail: AdjustmentBreakdown[] = [];

    for (const rule of sortedRules) {
      try {
        // Check if condition is met
        const conditionMet = typeof rule.condition === "function"
          ? rule.condition(facts)
          : rule.condition;

        if (conditionMet) {
          // Apply consequence
          const consequence = typeof rule.consequence === "function"
            ? rule.consequence(facts)
            : rule.consequence;

          result = consequence;

          // Add to audit trail if consequence has adjustment data
          if (
            consequence && typeof consequence === "object" &&
            "impact" in consequence
          ) {
            auditTrail.push({
              name: rule.name,
              value: consequence.impact,
              description: rule.description || "",
              percentAdjustment: 0, // Default percentAdjustment
              factor: rule.name,
              impact: consequence.impact,
            });
          }
        }
      } catch (error) {
        console.error(`Error evaluating rule '${rule.name}':`, error);
      }
    }

    return {
      result,
      auditTrail,
    };
  }
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
