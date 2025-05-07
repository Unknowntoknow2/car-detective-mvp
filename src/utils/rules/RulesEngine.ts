import { Rule } from './types';

export class RulesEngine {
  private rules: Rule[];

  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  public evaluate(data: any): any {
    let results: any = {};

    for (const rule of this.rules) {
      try {
        const condition = this.evaluateCondition(rule.condition, data);

        if (condition) {
          const consequence = this.evaluateConsequence(rule.consequence, data);
          results = { ...results, ...consequence };
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.name}:`, error);
      }
    }

    return results;
  }

  private evaluateCondition(condition: any, data: any): boolean {
    if (typeof condition === 'boolean') {
      return condition;
    }

    if (typeof condition === 'function') {
      return condition(data);
    }

    if (Array.isArray(condition)) {
      return condition.every(subCondition => this.evaluateCondition(subCondition, data));
    }

    if (typeof condition === 'object' && condition !== null) {
      const { fact, operator, value } = condition;
      const factValue = data[fact];

      switch (operator) {
        case 'equal':
          return factValue == value;
        case 'notEqual':
          return factValue != value;
        case 'greaterThan':
          return factValue > value;
        case 'lessThan':
          return factValue < value;
        case 'greaterThanOrEqual':
          return factValue >= value;
        case 'lessThanOrEqual':
          return factValue <= value;
        case 'contains':
          if (!Array.isArray(factValue)) {
            console.warn(`'contains' operator requires fact '${fact}' to be an array.`);
            return false;
          }
          return factValue.includes(value);
        case 'notContains':
          if (!Array.isArray(factValue)) {
            console.warn(`'notContains' operator requires fact '${fact}' to be an array.`);
            return false;
          }
          return !factValue.includes(value);
        case 'isOneOf':
          if (!Array.isArray(value)) {
            console.warn(`'isOneOf' operator requires value to be an array.`);
            return false;
          }
          return value.includes(factValue);
        case 'isNotOneOf':
          if (!Array.isArray(value)) {
            console.warn(`'isNotOneOf' operator requires value to be an array.`);
            return false;
          }
          return !value.includes(factValue);
        default:
          console.warn(`Unknown operator: ${operator}`);
          return false;
      }
    }

    console.warn(`Unknown condition type: ${typeof condition}`);
    return false;
  }

  private evaluateConsequence(consequence: any, data: any): any {
    if (typeof consequence === 'function') {
      return consequence(data);
    }

    if (typeof consequence === 'object' && consequence !== null) {
      let results: any = {};

      for (const key in consequence) {
        if (consequence.hasOwnProperty(key)) {
          const value = consequence[key];

          if (typeof value === 'function') {
            results[key] = value(data);
          } else {
            results[key] = value;
          }
        }
      }

      return results;
    }

    console.warn(`Unknown consequence type: ${typeof consequence}`);
    return {};
  }
}
