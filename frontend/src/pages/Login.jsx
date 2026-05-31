import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Login failed";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200">
        <Link to="/" className="mb-8 block text-center text-3xl font-extrabold text-[#0B1F3A]">Fincore</Link>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mb-6 mt-2 text-sm text-slate-500">Login to manage your accounts and transfers.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="form-input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="form-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            <FiLogIn /> {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link className="font-bold text-emerald-700" to="/forgot-password">Forgot password?</Link>
          <Link className="font-bold text-slate-700" to="/register">Create account</Link>
        </div>
      </section>
    </main>
  );
}
