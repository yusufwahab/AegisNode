const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "Aegis Node";

// Requirement: fall back to the emergency contact's address whenever a
// recipient isn't explicitly specified.
const FALLBACK_RECIPIENT = process.env.EMERGENCY_CONTACT_EMAIL || "adiyelogunolamide@gmail.com";

export const isEmailConfigured = Boolean(BREVO_API_KEY && SENDER_EMAIL);

if (!isEmailConfigured) {
  console.warn(
    "[email] BREVO_API_KEY / BREVO_SENDER_EMAIL not set — notify routes will respond with 503 " +
      "until they're configured."
  );
}

/**
 * Sends one transactional email via Brevo's REST API. `attachments` is an
 * array of { name, content } where `content` is already base64-encoded.
 */
export async function sendEmail({ to, subject, html, attachments }) {
  if (!isEmailConfigured) {
    throw new Error("Brevo isn't configured (BREVO_API_KEY / BREVO_SENDER_EMAIL missing).");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: SENDER_EMAIL, name: SENDER_NAME },
      to: [{ email: to || FALLBACK_RECIPIENT }],
      subject,
      htmlContent: html,
      ...(attachments?.length ? { attachment: attachments } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo request failed (${res.status}): ${body}`);
  }

  return res.json();
}
