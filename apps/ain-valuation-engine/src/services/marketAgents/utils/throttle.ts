// Tiny per-domain throttle: limits in-flight requests and spacing between them.
type QueueTask<T> = () => Promise<T>;

interface ThrottlePolicy {
  maxConcurrent: number;
  minDelayMs: number;
}

class DomainLimiter {
  private inFlight = 0;
  private queue: Array<() => void> = [];
  private last = 0;
  private readonly maxConcurrent: number;
  private readonly minDelayMs: number;
  constructor(policy: ThrottlePolicy) {
    this.maxConcurrent = policy.maxConcurrent;
    this.minDelayMs = policy.minDelayMs;
  }

  async run<T>(task: QueueTask<T>): Promise<T> {
    await this.acquire();
    try {
      const now = Date.now();
      const wait = Math.max(0, this.minDelayMs - (now - this.last));
      if (wait) await new Promise(r => setTimeout(r, wait));
      this.last = Date.now();
      return await task();
    } finally {
      this.release();
    }
  }

  private acquire(): Promise<void> {
    if (this.inFlight < this.maxConcurrent) {
      this.inFlight++;
      return Promise.resolve();
    }
    return new Promise(res => {
      this.queue.push(() => { this.inFlight++; res(); });
    });
  }
  private release() {
    this.inFlight--;
    const next = this.queue.shift();
    if (next) next();
  }
}

const limiters = new Map<string, DomainLimiter>();
export function limiterFor(host: string, policy?: ThrottlePolicy) {
  const key = host.replace(/^www\./, "");
  if (!limiters.has(key)) {
    // Use provided policy or fallback to env/defaults
    const p = policy || {
      maxConcurrent: Number(process.env.AIN_THROTTLE_MAX_CONCURRENCY ?? 2),
      minDelayMs: Number(process.env.AIN_THROTTLE_MIN_DELAY_MS ?? 250)
    };
    limiters.set(key, new DomainLimiter(p));
  }
  return limiters.get(key)!;
}
