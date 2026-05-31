import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Password reset failed";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    token: searchParams.get("token") || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await resetPassword(form);
      setMessage(response.data?.message || "Password updated successfully.");
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
        <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
        <p className="mb-6 mt-2 text-sm text-slate-500">Use the token from your reset email.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="form-input" placeholder="Reset token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} required />
          <input className="form-input" type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          {(message || error) && <p className={`rounded-lg px-4 py-3 text-sm font-semibold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Updating..." : "Reset password"}</button>
        </form>
        <Link className="mt-6 block text-center text-sm font-bold text-emerald-700" to="/login">Back to login</Link>
      </section>
    </main>
  );
}
