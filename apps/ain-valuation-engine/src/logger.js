export const logger = {
    info: (msg, meta) => console.log(`[INFO ${msg}`, meta ? JSON.stringify(meta) : ""),
    error: (msg, meta) => console.error(`[ERROR] ${msg}`, meta ? JSON.stringify(meta) : ""),
};
