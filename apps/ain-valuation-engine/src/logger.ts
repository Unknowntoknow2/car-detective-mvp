export const logger = {
  info: (msg: string, meta?: any) =>
    console.log(`[INFO ${msg}`, meta ? JSON.stringify(meta) : ""),
  error: (msg: string, meta?: any) =>
    console.error(`[ERROR] ${msg}`, meta ? JSON.stringify(meta) : ""),
};
