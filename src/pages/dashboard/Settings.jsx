import { useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import Toggle from "../../components/ui/Toggle";
import Button from "../../components/ui/Button";
import { useToast } from "../../lib/toastContext";
import { mockProfile } from "../../lib/mockData";

export default function Settings() {
  const [name, setName] = useState(mockProfile.name);
  const [email, setEmail] = useState("tunde.adegbola@example.com");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState({
    syncAlerts: true,
    productUpdates: false,
    smsBackup: true,
  });
  const pushToast = useToast();

  function handleSave(e) {
    e.preventDefault();
    pushToast?.("Settings saved.");
  }

  function handleDelete() {
    pushToast?.("Account deletion requested.");
  }

  return (
    <div className="max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl text-ink"
      >
        Settings
      </motion.h1>

      <form onSubmit={handleSave} className="mt-8 flex flex-col gap-4">
        <h2 className="text-lg text-ink">Profile</h2>
        <FormField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="primary" className="mt-2 self-start">
          Save Changes
        </Button>
      </form>

      <div className="mt-12">
        <h2 className="text-lg text-ink">Notifications</h2>
        <Card className="mt-4 flex flex-col gap-5">
          <Toggle
            label="Sync alerts"
            checked={notifications.syncAlerts}
            onChange={(v) => setNotifications((n) => ({ ...n, syncAlerts: v }))}
          />
          <Toggle
            label="Product updates"
            checked={notifications.productUpdates}
            onChange={(v) => setNotifications((n) => ({ ...n, productUpdates: v }))}
          />
          <Toggle
            label="SMS backup for critical alerts"
            checked={notifications.smsBackup}
            onChange={(v) => setNotifications((n) => ({ ...n, smsBackup: v }))}
          />
        </Card>
      </div>

      <div className="mt-12 rounded-card border border-coral/30 p-6">
        <h2 className="text-lg text-ink">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate">
          Deleting your account removes your profile and deactivates your tag permanently.
        </p>
        <Button variant="secondary" className="mt-4 border-coral/40 text-coral hover:border-coral hover:text-coral" onClick={handleDelete}>
          Delete Account
        </Button>
      </div>
    </div>
  );
}
