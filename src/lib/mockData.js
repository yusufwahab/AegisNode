export const mockProfile = {
  name: "Amara Chukwu",
  dob: "1994-03-12",
  bloodType: "O−",
  allergies: ["Penicillin", "Shellfish"],
  conditions: ["Type 1 Diabetes"],
  emergencyContact: {
    name: "Uche Chukwu",
    relationship: "Sibling",
    phone: "+234 802 555 0142",
  },
  tag: {
    status: "Active",
    id: "AGN-4471-KX",
    lastSynced: "2 hours ago",
    pendingSync: false,
  },
};

export const bloodTypes = ["O+", "O−", "A+", "A−", "B+", "B−", "AB+", "AB−"];

export const scanResult = {
  id: "AGN-4471-KX",
  name: "Amara Chukwu",
  dob: "1994-03-12",
  bloodType: "O−",
  allergies: ["Penicillin", "Shellfish"],
  conditions: ["Type 1 Diabetes"],
  medications: ["Insulin"],
  emergencyContact: {
    relationship: "Sibling",
    phone: "+234 802 555 0142",
  },
  scannedOffline: true,
};

export const hospitalAlerts = [
  {
    id: "a1",
    name: "Amara Chukwu",
    patientId: "AGN-4471-KX",
    bloodType: "O−",
    allergies: ["Penicillin"],
    eta: "4 min",
    status: "Incoming",
  },
  {
    id: "a2",
    name: "David Okon",
    patientId: "AGN-2290-RT",
    bloodType: "A+",
    allergies: ["None known"],
    eta: "9 min",
    status: "Incoming",
  },
  {
    id: "a3",
    name: "Fatima Bello",
    patientId: "AGN-1187-ZQ",
    bloodType: "B−",
    allergies: ["Latex", "Sulfa drugs"],
    eta: "Arrived",
    status: "Arrived",
  },
  {
    id: "a4",
    name: "Emeka Nwosu",
    patientId: "AGN-8802-LM",
    bloodType: "AB+",
    allergies: ["None known"],
    eta: "—",
    status: "Resolved",
  },
];

export const newAlertPool = [
  {
    name: "Grace Adeyemi",
    patientId: "AGN-5531-VN",
    bloodType: "AB−",
    allergies: ["Peanuts", "Aspirin"],
    eta: "6 min",
    status: "Incoming",
  },
  {
    name: "Tunde Bakare",
    patientId: "AGN-3390-QW",
    bloodType: "O+",
    allergies: ["None known"],
    eta: "3 min",
    status: "Incoming",
  },
];

export const trustStats = [
  { value: "< 2 sec", label: "Scan time" },
  { value: "100%", label: "Offline capable" },
  { value: "0", label: "Apps to install for patients" },
  { value: "Auto", label: "Sync on reconnect" },
];

export const howItWorksSteps = [
  {
    title: "Tap",
    copy: "A responder taps any NFC-enabled phone against your Aegis Node tag — no app, no unlocking, no signal required.",
    query: "hands closeup medical",
  },
  {
    title: "Cache",
    copy: "Your critical medical profile is stored directly on the tag and cached locally on the responder's device — it works with zero connectivity.",
    query: "clinical technology close-up",
  },
  {
    title: "Sync & Alert",
    copy: "The moment a connection is available, the scan syncs and the nearest partner hospital's triage dashboard lights up with an incoming alert.",
    query: "hospital corridor",
  },
];

export const hospitalFeatures = [
  {
    title: "Real-time triage dashboard",
    copy: "See incoming patients before they arrive, with blood type, allergies, and conditions front and center.",
  },
  {
    title: "Pre-arrival alerts",
    copy: "Every scan pushes a structured alert to your team the instant the responder's device reconnects.",
  },
  {
    title: "Integration-ready architecture",
    copy: "Webhook-based delivery designed to sit alongside existing hospital systems, not replace them.",
  },
  {
    title: "Structured patient data format",
    copy: "A consistent, versioned schema for blood type, allergies, conditions, and emergency contacts.",
  },
];

export const faqItems = [
  {
    q: "What if I lose my tag?",
    a: "Report it lost from your dashboard in one tap — the tag is deactivated immediately and a replacement ships within 3–5 business days.",
  },
  {
    q: "Is my data secure?",
    a: "Your profile is encrypted at rest on the tag and only readable by a scanning device at the moment of a tap. We don't claim it's unbreakable — we design conservatively and welcome scrutiny.",
  },
  {
    q: "Does it work internationally?",
    a: "The tag itself works anywhere NFC is supported. Hospital-side sync depends on partner coverage in your region, which we're expanding steadily.",
  },
  {
    q: "Do I need a smartphone to use it?",
    a: "No — the tag is passive. Any NFC-enabled phone, including a responder's, can read it. You don't need to own or carry anything beyond the tag.",
  },
];

export const credibilityLogos = [
  "EMT Alliance",
  "Regional Health Partners",
  "City Trauma Network",
  "Paramedic Guild",
  "Coastal Hospital Group",
];

export const teamMembers = [
  { name: "Ngozi Eze", role: "Co-Founder / Clinical" },
  { name: "Samuel Iwu", role: "Co-Founder / Engineering" },
  { name: "Priya Nair", role: "Hardware Lead" },
  { name: "Ben Okafor", role: "Partnerships" },
];
