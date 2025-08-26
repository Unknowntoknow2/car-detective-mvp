import axios from 'axios';
export class ApiClient {
    baseTimeout = 10000; // 10 seconds
    maxRetries = 3;
    retryDelay = 1000; // 1 second
    async makeRequest(url, options = {}) {
        const { method = 'GET', headers = {}, body, timeout = this.baseTimeout, retries = this.maxRetries, } = options;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await axios({
                    method,
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'AIN-Valuation-Engine/1.0',
                        ...headers,
                    },
                    data: body,
                    timeout,
                });
                return {
                    // ...existing code...
                    ok: true,
                    data: response.data,
                    metadata: {
                        source: url,
                        timestamp: new Date(),
                        rateLimit: this.extractRateLimit(response.headers),
                    },
                };
            }
            catch (error) {
                if (attempt === retries) {
                    return {
                        // ...existing code...
                        ok: false,
                        error: this.formatError(error),
                        metadata: {
                            source: url,
                            timestamp: new Date(),
                        },
                    };
                }
                // Wait before retry with exponential backoff
                const delay = this.retryDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        return {
            // ...existing code...
            ok: false,
            error: 'Maximum retries exceeded',
            metadata: {
                source: url,
                timestamp: new Date(),
            },
        };
    }
    extractRateLimit(headers) {
        const remaining = headers['x-ratelimit-remaining'];
        const reset = headers['x-ratelimit-reset'];
        const limit = headers['x-ratelimit-limit'];
        if (remaining && reset && limit) {
            return {
                remaining: parseInt(String(remaining)),
                resetTime: new Date(parseInt(String(reset)) * 1000),
                limit: parseInt(String(limit)),
            };
        }
        return undefined;
    }
    formatError(error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
            }
            else if (error.request) {
                return 'Network error: No response received';
            }
            else {
                return `Request error: ${error.message}`;
            }
        }
        return error instanceof Error ? error.message : 'Unknown error';
    }
    async get(url, headers) {
        return this.makeRequest(url, { method: 'GET', headers });
    }
    async post(url, body, headers) {
        return this.makeRequest(url, { method: 'POST', body, headers });
    }
    async put(url, body, headers) {
        return this.makeRequest(url, { method: 'PUT', body, headers });
    }
    async delete(url, headers) {
        return this.makeRequest(url, { method: 'DELETE', headers });
    }
}
export const apiClient = new ApiClient();
