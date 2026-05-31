import { useState } from "react";
import { FiShield } from "react-icons/fi";
import { depositInitialFunds } from "../services/transactionService";

const idempotencyKey = () =>
  crypto?.randomUUID?.() || `initial-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Initial deposit failed";

export default function InitialFunds() {
  const [form, setForm] = useState({ toAccount: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        toAccount: form.toAccount,
        toAccountId: form.toAccount,
        amount: Number(form.amount),
        idempotencyKey: idempotencyKey(),
      };
      const response = await depositInitialFunds(payload);
      setMessage(response.data?.message || "Initial funds deposited successfully.");
      setForm({ toAccount: "", amount: "" });
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl page-card">
      <h2 className="text-2xl font-extrabold text-slate-900">Initial Funds</h2>
      <p className="mt-1 text-sm text-slate-500">System users can deposit opening funds into a normal user account.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input className="form-input" placeholder="To Account" value={form.toAccount} onChange={(e) => setForm({ ...form, toAccount: e.target.value })} required />
        <input className="form-input" type="number" min="1" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        {(message || error) && <p className={`rounded-lg px-4 py-3 text-sm font-semibold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</p>}
        <button className="btn-primary" disabled={loading}>
          <FiShield /> {loading ? "Depositing..." : "Submit initial deposit"}
        </button>
      </form>
    </section>
  );
}
