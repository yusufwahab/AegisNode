const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function isWebNfcSupported() {
  return typeof window !== "undefined" && "NDEFReader" in window;
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

// Real tags store "+2348030001122 (Wife)" as one string — phone first,
// relationship in parentheses — with no separate contact-name field at all.
function parseContact(contact) {
  if (typeof contact !== "string" || !contact.trim()) {
    return { phone: "", relationship: "" };
  }
  const match = contact.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { phone: match[1].trim(), relationship: match[2].trim() };
  }
  return { phone: contact.trim(), relationship: "" };
}

// Avoids `Date` entirely so a "1988-04-12" string can't shift a day under a
// negative UTC offset — this is a birthdate on a medical card, not a log timestamp.
export function formatDob(dob) {
  if (typeof dob !== "string") return "";
  const match = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dob;
  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  return monthName ? `${monthName} ${Number(day)}, ${year}` : dob;
}

/**
 * Normalizes the real on-tag schema (short field names to save bytes on the
 * chip, comma-strings instead of arrays, a combined contact string) into the
 * shape EmergencyCard renders.
 */
export function parseTagPayload(raw) {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  const { phone, relationship } = parseContact(data.contact);

  return {
    id: data.id ?? "",
    name: data.name ?? "",
    dob: data.dob ?? "",
    bloodType: data.blood ?? data.bloodType ?? "",
    allergies: splitList(data.allergies),
    conditions: splitList(data.conditions),
    medications: splitList(data.meds ?? data.medications),
    emergencyContact: { relationship, phone },
  };
}

/**
 * Alternate on-tag format: instead of raw JSON, the tag stores a URL whose
 * query string carries the same fields (e.g. `/scan-demo?id=...&name=...`).
 * The OS opens that URL natively on tap on both Android and iOS, so this is
 * the cross-platform path — no Web NFC required at all. The trade-off is the
 * same as raw-JSON-on-chip: the data lives on the physical tag, so editing a
 * profile still means rewriting the tag, not just updating a database row.
 */
export function parseTagParams(searchParams) {
  const get = (key) => searchParams.get(key) || "";
  const explicitRelationship = get("relationship");
  const { phone, relationship } = explicitRelationship
    ? { phone: get("contact"), relationship: explicitRelationship }
    : parseContact(get("contact"));

  return {
    id: get("id"),
    name: get("name"),
    dob: get("dob"),
    bloodType: get("blood") || get("bloodType"),
    allergies: splitList(get("allergies")),
    conditions: splitList(get("conditions")),
    medications: splitList(get("meds") || get("medications")),
    emergencyContact: { relationship, phone },
  };
}

/**
 * One-shot Web NFC read: resolves with the raw text payload from the next
 * tag tapped. Must be called from a user gesture (e.g. a button click) —
 * Chrome only grants NFC permission in response to one.
 */
export function readNfcTagOnce({ signal } = {}) {
  return new Promise((resolve, reject) => {
    if (!isWebNfcSupported()) {
      reject(new Error("Web NFC isn't available in this browser."));
      return;
    }

    const reader = new window.NDEFReader();

    reader
      .scan({ signal })
      .then(() => {
        reader.onreading = (event) => {
          for (const record of event.message.records) {
            if (record.recordType === "text") {
              const decoder = new TextDecoder(record.encoding || "utf-8");
              resolve(decoder.decode(record.data));
              return;
            }
          }
          reject(new Error("That tag doesn't have a readable text record."));
        };
        reader.onreadingerror = () => {
          reject(new Error("Couldn't read that tag — try tapping again."));
        };
      })
      .catch(reject);
  });
}
