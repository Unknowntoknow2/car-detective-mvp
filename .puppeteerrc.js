
// Force skip all puppeteer downloads
export default {
  skipDownload: true,
  skipChromiumDownload: true,
  cacheDirectory: '/dev/null',
  executablePath: '/bin/false',
  browserRevision: 'none',
  product: 'none',
  // Prevent configuration object modifications
  freeze: true
};
