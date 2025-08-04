export const auditLogService = {
    async record(logEntry) {
        // Implement persistent logging if needed (DB, file, external service, etc.)
        // For now, just log to console for audit trail
        console.log("[AUDIT LOG]", JSON.stringify(logEntry));
    },
};
