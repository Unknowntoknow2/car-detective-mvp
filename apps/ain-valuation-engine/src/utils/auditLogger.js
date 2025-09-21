export async function auditLogger(event, details) {
    try {
        await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event, details, ts: new Date().toISOString() }),
        });
    }
    catch (e) {
    }
}
