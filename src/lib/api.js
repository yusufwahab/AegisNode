const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const isApiConfigured = Boolean(API_BASE_URL);

async function request(path, options) {
  if (!isApiConfigured) {
    throw new Error("VITE_API_BASE_URL isn't set — the backend isn't reachable yet.");
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// Called once a real scan resolves (URL-tap or Web NFC read) — turns it into
// a live "Incoming" row the hospital dashboard picks up via Supabase Realtime.
export function postScan(profile) {
  return request("/api/scans", { method: "POST", body: JSON.stringify(profile) });
}

export function updateAlertStatus(id, status) {
  return request(`/api/scans/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
