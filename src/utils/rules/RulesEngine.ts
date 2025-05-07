
import { Rule, RulesEngineInput, AdjustmentBreakdown } from './types';

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
        const conditionMet = typeof rule.condition === 'function' 
          ? rule.condition(facts)
          : rule.condition;
        
        if (conditionMet) {
          // Apply consequence
          const consequence = typeof rule.consequence === 'function'
            ? rule.consequence(facts)
            : rule.consequence;
          
          result = consequence;
          
          // Add to audit trail if consequence has adjustment data
          if (consequence && typeof consequence === 'object' && 'impact' in consequence) {
            auditTrail.push({
              factor: rule.name,
              impact: consequence.impact,
              name: rule.name, // For backward compatibility
              value: consequence.impact, // For backward compatibility
              description: rule.description || ''
            });
          }
        }
      } catch (error) {
        console.error(`Error evaluating rule '${rule.name}':`, error);
      }
    }

    return {
      result,
      auditTrail
    };
  }
}

// Use 'export type' for re-exporting types to avoid isolatedModules error
export type { AdjustmentBreakdown };
