import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import Loader from "../components/Loader";
import { createAccount } from "../services/accountService";

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Unable to create account";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currency: "INR",
    accountType: "savings",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await createAccount(form);

      await wait(5000);

      navigate("/account-created", {
        state: {
          status: "success",
          message: response.data?.message || "Account created successfully.",
          request: form,
          response: response.data,
        },
      });
    } catch (err) {
      await wait(5000);

      navigate("/account-created", {
        state: {
          status: "failed",
          message: getMessage(err),
          request: form,
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
          <Loader label="Creating your account..." />
          <p className="max-w-md text-sm text-slate-500">
            Please wait while Fincore creates your account and prepares the
            account details.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl page-card">
      <h2 className="text-2xl font-extrabold text-slate-900">
        Create Account
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Create an additional account under your profile.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Currency
          </label>
          <select
            className="form-input"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Account type
          </label>
          <select
            className="form-input"
            value={form.accountType}
            onChange={(e) =>
              setForm({ ...form, accountType: e.target.value })
            }
          >
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </select>
        </div>

        <button className="btn-primary" disabled={loading}>
          <FiPlusCircle /> Create account
        </button>
      </form>
    </section>
  );
}