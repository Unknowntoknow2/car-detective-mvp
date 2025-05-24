
// Force skip all puppeteer downloads and prevent configuration
const config = {
  skipDownload: true,
  skipChromiumDownload: true,
  cacheDirectory: '/dev/null',
  executablePath: '/bin/false',
  browserRevision: 'none',
  product: 'none',
  freeze: true
};

// Make the config immutable to prevent any modifications
Object.freeze(config);

// Export as default and ensure it can't be modified
export default Object.defineProperty(Object, 'config', {
  value: config,
  writable: false,
  configurable: false
});

// Also export individual properties with getters only
export const skipDownload = true;
export const skipChromiumDownload = true;
export const cacheDirectory = '/dev/null';
export const executablePath = '/bin/false';
export const browserRevision = 'none';
export const product = 'none';
