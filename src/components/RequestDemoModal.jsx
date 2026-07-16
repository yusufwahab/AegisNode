import { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useToast } from "../lib/toastContext";

const FIELD_CLASS =
  "min-h-[44px] w-full rounded-sm border border-mist bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition-shadow duration-200 focus:border-teal focus:shadow-[0_0_0_3px_rgba(14,79,69,0.12)]";

export default function RequestDemoModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", org: "", email: "", message: "" });
  const pushToast = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    pushToast?.("Request sent — we'll be in touch shortly.");
    setForm({ name: "", org: "", email: "", message: "" });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Request a Partner Walkthrough">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Name</label>
          <input
            required
            className={FIELD_CLASS}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Hospital / Org</label>
          <input
            required
            className={FIELD_CLASS}
            value={form.org}
            onChange={(e) => setForm({ ...form, org: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            className={FIELD_CLASS}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
          <textarea
            rows={3}
            className={FIELD_CLASS}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
        <Button type="submit" variant="primary" className="mt-2 w-full">
          Send Request
        </Button>
      </form>
    </Modal>
  );
}
