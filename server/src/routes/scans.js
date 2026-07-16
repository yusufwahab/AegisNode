import { Router } from "express";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

export const scansRouter = Router();

function toRow(profile) {
  return {
    patient_ref: profile.id || null,
    name: profile.name,
    blood_type: profile.bloodType || null,
    allergies: Array.isArray(profile.allergies) ? profile.allergies : [],
    conditions: Array.isArray(profile.conditions) ? profile.conditions : [],
    medications: Array.isArray(profile.medications) ? profile.medications : [],
    contact_relationship: profile.emergencyContact?.relationship || null,
    contact_phone: profile.emergencyContact?.phone || null,
  };
}

function toApi(row) {
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

function requireSupabase(_req, res, next) {
  if (!isSupabaseConfigured) {
    return res.status(503).json({ error: "Supabase isn't configured on this server yet." });
  }
  next();
}

// List alerts, newest first — used by the hospital dashboard's initial load
// (realtime subscription handles updates after that).
scansRouter.get("/", requireSupabase, async (_req, res) => {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(toApi));
});

// A real scan (URL-tap or Web NFC read) reaches here and becomes a live
// "Incoming" alert. Only requires a name — everything else on a tag is
// optional by nature (a patient may not have listed allergies, etc).
scansRouter.post("/", requireSupabase, async (req, res) => {
  const profile = req.body;
  if (!profile?.name) {
    return res.status(400).json({ error: "A name is required to log a scan." });
  }

  const { data, error } = await supabase
    .from("alerts")
    .insert({ ...toRow(profile), status: "Incoming" })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(toApi(data));
});

const VALID_STATUSES = new Set(["Incoming", "Arrived", "Resolved"]);

scansRouter.patch("/:id/status", requireSupabase, async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: `status must be one of: ${[...VALID_STATUSES].join(", ")}` });
  }

  const { data, error } = await supabase
    .from("alerts")
    .update({ status })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(toApi(data));
});
