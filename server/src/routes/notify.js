import { Router } from "express";
import { sendEmail, isEmailConfigured } from "../lib/email.js";
import { buildPatientCsv } from "../lib/csv.js";

export const notifyRouter = Router();

const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || "Yabvilinfotech@gmail.com";
const HOSPITAL_NAME = process.env.HOSPITAL_NAME || "Yabvil Hospital";
const HOSPITAL_CONTACT_PHONE = process.env.HOSPITAL_CONTACT_PHONE || "";
const EMERGENCY_CONTACT_EMAIL = process.env.EMERGENCY_CONTACT_EMAIL || "adiyelogunolamide@gmail.com";

function hospitalEmailHtml(profile, scannedAt) {
  const allergies = profile.allergies?.length ? profile.allergies.join(", ") : "None known";
  const conditions = profile.conditions?.length ? profile.conditions.join(", ") : "None known";
  const medications = profile.medications?.length ? profile.medications.join(", ") : "None known";
  const contact = [profile.emergencyContact?.relationship, profile.emergencyContact?.phone]
    .filter(Boolean)
    .join(" · ") || "Not provided";

  return `
    <div style="font-family: sans-serif; color: #12181B;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #E4572E;">
        Incoming Patient Scan
      </p>
      <h2 style="margin: 4px 0 16px;">${profile.name}</h2>
      <p><strong>Patient ID:</strong> ${profile.id || "—"}</p>
      <p><strong>Blood Type:</strong> ${profile.bloodType || "—"}</p>
      <p><strong>Allergies:</strong> ${allergies}</p>
      <p><strong>Conditions:</strong> ${conditions}</p>
      <p><strong>Medications:</strong> ${medications}</p>
      <p><strong>Emergency Contact:</strong> ${contact}</p>
      <p><strong>Scanned At:</strong> ${scannedAt}</p>
      <p style="margin-top: 16px; color: #5B6664; font-size: 13px;">
        A CSV copy of this record is attached. Sent automatically by Aegis Node.
      </p>
    </div>
  `;
}

function contactEmailHtml(profile, scannedAt) {
  const phoneLine = HOSPITAL_CONTACT_PHONE
    ? `<p>You can reach the hospital directly at <strong>${HOSPITAL_CONTACT_PHONE}</strong>.</p>`
    : `<p>Please contact ${HOSPITAL_NAME} directly for more information.</p>`;

  return `
    <div style="font-family: sans-serif; color: #12181B;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #0E4F45;">
        Aegis Node Alert
      </p>
      <h2 style="margin: 4px 0 16px;">${profile.name} is currently at ${HOSPITAL_NAME}</h2>
      <p>
        This is an automated message to let you know that ${profile.name}'s Aegis Node tag was
        scanned at <strong>${scannedAt}</strong>, and they are currently receiving care at
        <strong>${HOSPITAL_NAME}</strong>.
      </p>
      ${phoneLine}
      <p style="margin-top: 16px; color: #5B6664; font-size: 13px;">
        This is an automated notification and may not reflect the patient's current condition.
      </p>
    </div>
  `;
}

notifyRouter.post("/", async (req, res) => {
  if (!isEmailConfigured) {
    return res.status(503).json({ error: "Email isn't configured on this server yet." });
  }

  const profile = req.body;
  if (!profile?.name) {
    return res.status(400).json({ error: "A name is required to send a notification." });
  }

  const scannedAt = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
  const results = {};

  try {
    const csv = buildPatientCsv(profile, scannedAt);
    await sendEmail({
      to: HOSPITAL_EMAIL,
      subject: `Incoming Patient Scan — ${profile.name}`,
      html: hospitalEmailHtml(profile, scannedAt),
      attachments: [
        {
          name: `${profile.name.replace(/\s+/g, "-")}-scan.csv`,
          content: Buffer.from(csv, "utf-8").toString("base64"),
        },
      ],
    });
    results.hospital = "sent";
  } catch (err) {
    results.hospital = `error: ${err.message}`;
  }

  try {
    await sendEmail({
      to: EMERGENCY_CONTACT_EMAIL,
      subject: `${profile.name} has been scanned in at ${HOSPITAL_NAME}`,
      html: contactEmailHtml(profile, scannedAt),
    });
    results.contact = "sent";
  } catch (err) {
    results.contact = `error: ${err.message}`;
  }

  const ok = results.hospital === "sent" && results.contact === "sent";
  res.status(ok ? 200 : 207).json({ results });
});
