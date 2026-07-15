import { useState } from "react";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import Toggle from "../../components/ui/Toggle";
import Button from "../../components/ui/Button";
import { useToast } from "../../lib/toastContext";

export default function HospitalSettings() {
  const [org, setOrg] = useState("Coastal General Hospital");
  const [webhook, setWebhook] = useState("https://coastal-general.example/webhooks/aegis");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const pushToast = useToast();

  function handleSave(e) {
    e.preventDefault();
    pushToast?.("Settings saved.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl text-ink">Settings</h1>

      <form onSubmit={handleSave} className="mt-8 flex flex-col gap-4">
        <FormField label="Organization Name" value={org} onChange={(e) => setOrg(e.target.value)} />
        <FormField label="Webhook URL" value={webhook} onChange={(e) => setWebhook(e.target.value)} />
        <Button type="submit" variant="primary" className="mt-2 self-start">
          Save Changes
        </Button>
      </form>

      <div className="mt-12">
        <h2 className="text-lg text-ink">Notifications</h2>
        <Card className="mt-4">
          <Toggle
            label="Real-time incoming alert notifications"
            checked={alertsEnabled}
            onChange={setAlertsEnabled}
          />
        </Card>
      </div>
    </div>
  );
}
