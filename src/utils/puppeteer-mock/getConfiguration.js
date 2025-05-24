
// Mock implementation of Puppeteer's getConfiguration
// This file is not used directly but may help if Puppeteer is somehow loaded

export function getConfiguration() {
  return Object.freeze({
    logLevel: 'error',
    skipDownload: true,
    skipChromiumDownload: true,
    browserRevision: 'none',
    product: 'none',
    executablePath: '/bin/false',
    cacheDirectory: '/dev/null'
  });
}

export default getConfiguration;
