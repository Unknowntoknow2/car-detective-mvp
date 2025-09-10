const logger = {
  info: (...a: any[]) => console.log(...a),
  warn: (...a: any[]) => console.warn(...a),
  error: (...a: any[]) => console.error(...a),
  debug: (...a: any[]) => console.debug(...a),
};
export default logger;
