
/**
 * Complete mock implementation of Puppeteer's getConfiguration
 * This provides a frozen, immutable configuration object that prevents any modifications
 */

// Create a frozen configuration object that cannot be modified
const frozenConfig = Object.freeze({
  logLevel: 'silent',
  skipDownload: true,
  skipChromiumDownload: true,
  browserRevision: 'none',
  product: 'none',
  executablePath: '/bin/false',
  cacheDirectory: '/dev/null',
  isExtensible: false
});

// Export functions that return the frozen config
export function getConfiguration() {
  return frozenConfig;
}

// Create proxied version that traps any attempts to modify
export const protectedConfig = new Proxy(frozenConfig, {
  set() {
    console.warn('Attempt to modify puppeteer config blocked');
    return true; // Silently fail
  },
  get(target, prop) {
    return target[prop];
  }
});

// Export a factory function that's often used
export function createConfiguration() {
  return frozenConfig;
}

export default getConfiguration;
