import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Request failed";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await forgotPassword({ email });
      setMessage(response.data?.message || "Password reset instructions sent.");
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage title="Forgot password" subtitle="Enter your email to receive reset instructions.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="form-input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {(message || error) && <p className={`rounded-lg px-4 py-3 text-sm font-semibold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
      </form>
      <Link className="mt-6 block text-center text-sm font-bold text-emerald-700" to="/login">Back to login</Link>
    </AuthPage>
  );
}

function AuthPage({ title, subtitle, children }) {
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
