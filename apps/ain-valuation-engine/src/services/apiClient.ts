import axios, { AxiosResponse } from 'axios';
import { ApiResponse, RateLimit } from '../types/ValuationTypes';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string | FormData;
  timeout?: number;
  retries?: number;
}

export class ApiClient {
  private baseTimeout = 10000; // 10 seconds
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async makeRequest<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.baseTimeout,
      retries = this.maxRetries,
    } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response: AxiosResponse<T> = await axios({
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
      } catch (error) {
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

  private extractRateLimit(headers: Record<string, unknown>): RateLimit | undefined {
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

  private formatError(error: Error | unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        return 'Network error: No response received';
      } else {
        return `Request error: ${error.message}`;
      }
    }
    return error instanceof Error ? error.message : 'Unknown error';
  }

  public async get<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET', headers });
  }

  public async post<T>(
    url: string,
    body: Record<string, unknown> | string | FormData,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'POST', body, headers });
  }

  public async put<T>(
    url: string,
    body: Record<string, unknown> | string | FormData,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'PUT', body, headers });
  }

  public async delete<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();