import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { register } from "../services/authService";

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await register(form);
      setMessage("Registration successful. You can now login.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your Fincore account" subtitle="Start with a secure banking profile.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="form-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="form-input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="form-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
        <select className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Normal User</option>
          <option value="system">System User</option>
        </select>
        <Feedback success={message} error={error} />
        <button className="btn-primary w-full" disabled={loading}>
          <FiUserPlus /> {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered? <Link className="font-bold text-emerald-700" to="/login">Login</Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200">
        <Link to="/" className="mb-8 block text-center text-3xl font-extrabold text-[#0B1F3A]">Fincore</Link>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mb-6 mt-2 text-sm text-slate-500">{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

function Feedback({ success, error }) {
  if (!success && !error) return null;
  return (
    <p className={`rounded-lg px-4 py-3 text-sm font-semibold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
      {error || success}
    </p>
  );
}
