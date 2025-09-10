// BaseMarketAgent: Abstract base class for all market agents
export abstract class BaseMarketAgent {
  abstract name(): string;
  // Optionally, you can define a run method for CLI compatibility
  async run(params: any): Promise<any[]> {
    const raw = await this.fetch(params);
    if (typeof this.normalize === 'function') {
      return this.normalize(raw);
    }
    return raw;
  }
  abstract fetch(params: any): Promise<any[]>;
  abstract normalize(raw: any[]): Promise<any[]>;
}
