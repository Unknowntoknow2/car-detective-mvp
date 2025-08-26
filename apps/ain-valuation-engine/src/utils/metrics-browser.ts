type Counter = { inc: (..._a:any[]) => void };
type Gauge   = { inc: (..._a:any[]) => void; dec: (..._a:any[]) => void };
type Summary = { observe: (..._a:any[]) => void; startTimer: (..._a:any[]) => (..._b:any[]) => void };
type Histogram = Summary;

const mkCounter = (): Counter => ({ inc: () => {} });
const mkGauge   = (): Gauge   => ({ inc: () => {}, dec: () => {} });
const mkSummary = (): Summary => ({ observe: () => {}, startTimer: () => (..._labels:any[]) => void 0 });

export const apiCallsTotal: Counter = mkCounter();
export const httpRequestDuration: Histogram = mkSummary();
export const httpRequestTotal: Counter = mkCounter();
export const activeConnections: Gauge = mkGauge();
export const valuationRequestsTotal: Counter = mkCounter();
export const valuationDuration: Summary = mkSummary();
export const databaseOperations: Counter = mkCounter();
export default {};
