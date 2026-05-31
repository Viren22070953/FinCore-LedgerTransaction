import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiRepeat } from "react-icons/fi";
import Loader from "../components/Loader";
import { createTransaction } from "../services/transactionService";

const createIdempotencyKey = () =>
  crypto?.randomUUID?.() ||
  `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Transfer failed";

export default function TransferMoney() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const idempotencyKey = createIdempotencyKey();

    const transferDetails = {
      fromAccount: form.fromAccount,
      toAccount: form.toAccount,
      amount: Number(form.amount),
      idempotencyKey,
      requestedAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      const payload = {
        fromAccount: form.fromAccount,
        fromAccountId: form.fromAccount,
        toAccount: form.toAccount,
        toAccountId: form.toAccount,
        amount: Number(form.amount),
        idempotencyKey,
      };

      const response = await createTransaction(payload);

      navigate("/transaction-result", {
        state: {
          status: "success",
          message:
            response.data?.message || "Transaction completed successfully.",
          details: transferDetails,
          response: response.data,
        },
      });
    } catch (err) {
      navigate("/transaction-result", {
        state: {
          status: "failed",
          message: getMessage(err),
          details: transferDetails,
          response: err?.response?.data || null,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl page-card">
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
          <Loader label="Processing your transfer..." />
          <p className="max-w-md text-sm text-slate-500">
            Please wait while Fincore validates the request and creates the debit
            and credit ledger entries.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl page-card">
      <h2 className="text-2xl font-extrabold text-slate-900">
        Transfer Money
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        A unique idempotency key is generated automatically for every transfer.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="form-input"
          placeholder="From Account"
          value={form.fromAccount}
          onChange={(e) =>
            setForm({ ...form, fromAccount: e.target.value })
          }
          required
        />

        <input
          className="form-input"
          placeholder="To Account"
          value={form.toAccount}
          onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
          required
        />

        <input
          className="form-input"
          type="number"
          min="1"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />

        <button className="btn-primary" disabled={loading}>
          <FiRepeat /> Submit transfer
        </button>
      </form>
    </section>
  );
}