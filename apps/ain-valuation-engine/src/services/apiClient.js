export class ApiClient {
  async get(url, options) {
    const res = await fetch(url, { method: "GET", ...(options || {}) });
    try { return await res.json(); } catch { return await res.text(); }
  }
  async post(url, body, options) {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
      headers: { "content-type": "application/json", ...(options?.headers || {}) },
      ...(options || {}),
    });
    try { return await res.json(); } catch { return await res.text(); }
  }
}
export const apiClient = new ApiClient();
export default apiClient;
