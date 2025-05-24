
/**
 * Aggressive Puppeteer prevention configuration
 * This file prevents any Puppeteer downloads or installations
 */

// Create configuration with all possible flags to prevent downloads
const immutableConfig = Object.freeze({
  skipDownload: true,
  skipChromiumDownload: true,
  cacheDirectory: '/dev/null',
  executablePath: '/bin/false',
  browserRevision: 'none',
  product: 'none',
  logLevel: 'silent',
  noDownload: true,
  disableAutoDownload: true
});

// Export as default, but make it immutable through multiple mechanisms
export default Object.freeze(
  Object.defineProperties(
    {},
    Object.getOwnPropertyNames(immutableConfig).reduce((result, key) => {
      result[key] = {
        value: immutableConfig[key],
        writable: false,
        configurable: false,
        enumerable: true
      };
      return result;
    }, {})
  )
);

// Also export as individual constants
export const skipDownload = true;
export const skipChromiumDownload = true;
export const cacheDirectory = '/dev/null';
export const executablePath = '/bin/false';
export const browserRevision = 'none';
export const product = 'none';
export const logLevel = 'silent';
export const noDownload = true;
export const disableAutoDownload = true;

// Add a global override that will be picked up if imported
if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'PUPPETEER_SKIP_DOWNLOAD', {
    value: true,
    writable: false,
    configurable: false
  });
}
