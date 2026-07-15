import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!form.email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Enter your password.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg bg-paper p-8 shadow-xl md:p-10"
    >
      <h1 className="text-2xl text-ink md:text-3xl">Welcome back</h1>
      <p className="mt-2 text-[15px] text-slate">Log in to manage your profile and tag.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <FormField
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormField
          label="Password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" variant="primary" className="mt-2 w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        New to Aegis Node?{" "}
        <Link to="/signup" className="font-medium text-teal hover:underline">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
