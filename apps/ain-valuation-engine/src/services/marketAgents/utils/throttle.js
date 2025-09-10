class DomainLimiter {
    inFlight = 0;
    queue = [];
    last = 0;
    maxConcurrent;
    minDelayMs;
    constructor(policy) {
        this.maxConcurrent = policy.maxConcurrent;
        this.minDelayMs = policy.minDelayMs;
    }
    async run(task) {
        await this.acquire();
        try {
            const now = Date.now();
            const wait = Math.max(0, this.minDelayMs - (now - this.last));
            if (wait)
                await new Promise(r => setTimeout(r, wait));
            this.last = Date.now();
            return await task();
        }
        finally {
            this.release();
        }
    }
    acquire() {
        if (this.inFlight < this.maxConcurrent) {
            this.inFlight++;
            return Promise.resolve();
        }
        return new Promise(res => {
            this.queue.push(() => { this.inFlight++; res(); });
        });
    }
    release() {
        this.inFlight--;
        const next = this.queue.shift();
        if (next)
            next();
    }
}
const limiters = new Map();
export function limiterFor(host, policy) {
    const key = host.replace(/^www\./, "");
    if (!limiters.has(key)) {
        // Use provided policy or fallback to env/defaults
        const p = policy || {
            maxConcurrent: Number(process.env.AIN_THROTTLE_MAX_CONCURRENCY ?? 2),
            minDelayMs: Number(process.env.AIN_THROTTLE_MIN_DELAY_MS ?? 250)
        };
        limiters.set(key, new DomainLimiter(p));
    }
    return limiters.get(key);
}
