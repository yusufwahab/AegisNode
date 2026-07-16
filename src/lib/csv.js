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
  "Row",
  "Patient ID",
  "Name",
  "Blood Type",
  "Allergies",
  "Conditions",
  "Medications",
  "Emergency Contact",
  "Scanned At",
  "Current Scan",
];

function profileRow(profile, rowNumber, isCurrent) {
  const contact = [profile.emergencyContact?.relationship, profile.emergencyContact?.phone]
    .filter(Boolean)
    .join(" - ");

  return [
    rowNumber,
    profile.id || "",
    profile.name || "",
    profile.bloodType || "",
    profile.allergies?.length ? profile.allergies.join("; ") : "None known",
    profile.conditions?.length ? profile.conditions.join("; ") : "None known",
    profile.medications?.length ? profile.medications.join("; ") : "None known",
    contact || "Not provided",
    profile.scannedAt || "",
    isCurrent ? "Yes — this scan" : "",
  ];
}

/**
 * Builds the "hospital database" CSV shown on the scan demo: fixed mock rows
 * first, then the just-scanned profile appended last and flagged as current
 * — so opening the file shows exactly where this scan landed among others.
 */
export function buildDatabaseCsv(mockRows, currentProfile, currentScannedAt) {
  const mockLines = mockRows.map((row, i) => toCsvRow(profileRow(row, i + 1, false)));
  const currentRowNumber = mockRows.length + 1;
  const currentLine = toCsvRow(
    profileRow({ ...currentProfile, scannedAt: currentScannedAt }, currentRowNumber, true)
  );

  return [toCsvRow(HEADER), ...mockLines, currentLine].join("\r\n");
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
