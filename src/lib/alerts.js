import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { hospitalAlerts } from "./mockData";

function mapRow(row) {
  return {
    id: row.id,
    patientId: row.patient_ref,
    name: row.name,
    bloodType: row.blood_type,
    allergies: row.allergies || [],
    conditions: row.conditions || [],
    medications: row.medications || [],
    emergencyContact: {
      relationship: row.contact_relationship,
      phone: row.contact_phone,
    },
    status: row.status,
    createdAt: row.created_at,
  };
}

// Falls back to mock data if Supabase isn't configured yet, same pattern as
// the Unsplash integration — the dashboard should never show a broken/empty
// screen just because env vars haven't been pasted in yet.
const mockFallback = () => hospitalAlerts.map((alert) => ({ ...alert, source: "mock" }));

export async function fetchAlerts() {
  if (!isSupabaseConfigured) return mockFallback();

  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return mockFallback();
  return data.map(mapRow);
}

export function subscribeToAlerts({ onInsert, onUpdate }) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel("alerts-changes")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) =>
      onInsert(mapRow(payload.new))
    )
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "alerts" }, (payload) =>
      onUpdate(mapRow(payload.new))
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
