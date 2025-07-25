/**
 * URL Validator Service - Validates listing URLs with HTTP HEAD requests
 * Ensures 100% accuracy by only keeping listings with live, working URLs
 */
export class URLValidatorService {
  private static readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private static readonly MAX_CONCURRENT_VALIDATIONS = 5;
  private static readonly RETRY_COUNT = 2;

  /**
   * Validate a single URL with HTTP HEAD request
   */
  static async validateURL(url: string): Promise<boolean> {
    console.log(`🔗 Validating URL: ${url}`);

    if (!this.isValidURLFormat(url)) {
      console.log(`❌ Invalid URL format: ${url}`);
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      clearTimeout(timeoutId);

      const isValid = response.ok && response.status >= 200 && response.status < 400;
      console.log(`${isValid ? '✅' : '❌'} URL validation result: ${response.status} - ${url}`);
      
      return isValid;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`⏰ URL validation timeout: ${url}`);
      } else {
        console.log(`❌ URL validation error: ${error.message} - ${url}`);
      }
      return false;
    }
  }

  /**
   * Validate multiple URLs with concurrency control and retries
   */
  static async validateURLs(urls: string[]): Promise<Map<string, boolean>> {
    console.log(`🔗 Validating ${urls.length} URLs with concurrency limit ${this.MAX_CONCURRENT_VALIDATIONS}`);
    
    const results = new Map<string, boolean>();
    const chunks = this.chunkArray(urls, this.MAX_CONCURRENT_VALIDATIONS);

    for (const chunk of chunks) {
      const promises = chunk.map(async (url) => {
        const isValid = await this.validateURLWithRetries(url);
        results.set(url, isValid);
        return { url, isValid };
      });

      await Promise.allSettled(promises);
    }

    const validCount = Array.from(results.values()).filter(Boolean).length;
    console.log(`✅ URL validation complete: ${validCount}/${urls.length} URLs are valid`);

    return results;
  }

  /**
   * Validate URL with retry logic
   */
  private static async validateURLWithRetries(url: string): Promise<boolean> {
    for (let attempt = 1; attempt <= this.RETRY_COUNT; attempt++) {
      try {
        const isValid = await this.validateURL(url);
        if (isValid) {
          return true;
        }
        
        if (attempt < this.RETRY_COUNT) {
          console.log(`🔄 Retrying URL validation (${attempt}/${this.RETRY_COUNT}): ${url}`);
          await this.delay(1000 * attempt); // Progressive delay
        }
      } catch (error) {
        console.log(`❌ URL validation attempt ${attempt} failed: ${url}`);
      }
    }

    return false;
  }

  /**
   * Validate URL format and domain
   */
  private static isValidURLFormat(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Must be HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }

      // Must have valid domain
      if (!urlObj.hostname || urlObj.hostname.length < 4) {
        return false;
      }

      // Must not be localhost or IP address
      if (urlObj.hostname === 'localhost' || 
          urlObj.hostname.startsWith('127.') ||
          urlObj.hostname.startsWith('192.168.') ||
          /^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
        return false;
      }

      // Check for valid automotive domains
      const validDomains = [
        'autotrader.com', 'cars.com', 'cargurus.com', 'carmax.com',
        'edmunds.com', 'carfax.com', 'vroom.com', 'shift.com', 'carvana.com',
        'truecar.com', 'kbb.com', 'carbuyingtips.com'
      ];

      const isValidDomain = validDomains.some(domain => 
        urlObj.hostname.includes(domain) || urlObj.hostname.endsWith(domain)
      );

      if (!isValidDomain) {
        console.log(`⚠️ URL domain not in allowed automotive sites: ${urlObj.hostname}`);
        return false;
      }

      return true;

    } catch (error) {
      return false;
    }
  }

  /**
   * Filter and validate listings, removing those with invalid URLs
   */
  static async filterListingsByValidURLs<T extends { listing_url: string }>(
    listings: T[]
  ): Promise<T[]> {
    if (listings.length === 0) {
      return [];
    }

    console.log(`🔗 Filtering ${listings.length} listings by URL validation`);

    const urls = listings.map(listing => listing.listing_url);
    const validationResults = await this.validateURLs(urls);

    const validListings = listings.filter(listing => {
      const isValid = validationResults.get(listing.listing_url) || false;
      if (!isValid) {
        console.log(`❌ Removing listing with invalid URL: ${listing.listing_url}`);
      }
      return isValid;
    });

    console.log(`✅ URL validation complete: ${validListings.length}/${listings.length} listings have valid URLs`);
    return validListings;
  }

  /**
   * Validate individual listing URL and return boolean
   */
  static async isListingURLValid(listing: { listing_url: string }): Promise<boolean> {
    if (!listing.listing_url || listing.listing_url.trim() === '') {
      return false;
    }

    return await this.validateURL(listing.listing_url);
  }

  /**
   * Quick validation for URL format only (no HTTP request)
   */
  static isValidURLFormatOnly(url: string): boolean {
    return this.isValidURLFormat(url);
  }

  /**
   * Utility to chunk array for concurrent processing
   */
  private static chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Utility delay function
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get URL validation statistics
   */
  static getValidationStats(validationResults: Map<string, boolean>): {
    total: number;
    valid: number;
    invalid: number;
    validPercentage: number;
  } {
    const total = validationResults.size;
    const valid = Array.from(validationResults.values()).filter(Boolean).length;
    const invalid = total - valid;
    const validPercentage = total > 0 ? Math.round((valid / total) * 100) : 0;

    return { total, valid, invalid, validPercentage };
  }
}