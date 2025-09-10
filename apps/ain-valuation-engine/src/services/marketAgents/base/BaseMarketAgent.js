// BaseMarketAgent: Abstract base class for all market agents
export class BaseMarketAgent {
    // Optionally, you can define a run method for CLI compatibility
    async run(params) {
        const raw = await this.fetch(params);
        if (typeof this.normalize === 'function') {
            return this.normalize(raw);
        }
        return raw;
    }
}
