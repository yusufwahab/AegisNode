import "dotenv/config";
import express from "express";
import cors from "cors";
import { scansRouter } from "./routes/scans.js";
import { isSupabaseConfigured } from "./lib/supabase.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, supabaseConfigured: isSupabaseConfigured });
});

app.use("/api/scans", scansRouter);

app.listen(PORT, () => {
  console.log(`Aegis Node API listening on port ${PORT}`);
});
