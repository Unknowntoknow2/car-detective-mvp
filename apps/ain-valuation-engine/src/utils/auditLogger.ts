export async function auditLogger(event: string, details: Record<string, any>) {
  try {
    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, details, ts: new Date().toISOString() }),
    });
  } catch (e) {
    console.warn("Audit log failed:", e);
  }
}
