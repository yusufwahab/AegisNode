function csvEscape(value) {
  const str = String(value ?? "");
  if (/["\n,]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(values) {
  return values.map(csvEscape).join(",");
}

const HEADER = [
  "Patient ID",
  "Name",
  "Date of Birth",
  "Blood Type",
  "Allergies",
  "Conditions",
  "Medications",
  "Emergency Contact Relationship",
  "Emergency Contact Phone",
  "Scanned At",
];

// Plain CSV rather than a real .xlsx — zero dependencies, and Excel/Sheets
// both open it natively; nothing here needs formulas or styling.
export function buildPatientCsv(profile, scannedAt) {
  const row = [
    profile.id || "",
    profile.name || "",
    profile.dob || "",
    profile.bloodType || "",
    (profile.allergies || []).join("; "),
    (profile.conditions || []).join("; "),
    (profile.medications || []).join("; "),
    profile.emergencyContact?.relationship || "",
    profile.emergencyContact?.phone || "",
    scannedAt,
  ];
  return [toCsvRow(HEADER), toCsvRow(row)].join("\r\n");
}
