import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiDollarSign } from "react-icons/fi";
import { getBalance } from "../services/accountService";

const getMessage = (error) =>
  error?.response?.data?.message || error?.message || "Unable to fetch balance";

const extractBalanceDetails = (data) => {
  const source = data?.data || data;

  const amount =
    source?.Balance ??
    source?.balance ??
    source?.account?.balance ??
    source?.accountBalance ??
    source?.accountBalance?.balance ??
    source?.availableBalance ??
    source?.currentBalance ??
    source?.ledgerBalance ??
    source?.totalBalance ??
    source?.amount ??
    0;

  return {
    amount,
    currency:
      source?.currency ||
      source?.account?.currency ||
      source?.accountBalance?.currency ||
      "INR",
    accountId:
      source?.accountId ||
      source?._id ||
      source?.account?._id ||
      source?.account?.accountId,
  };
};

const formatMoney = (amount, currency) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return amount;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

export default function CheckBalance() {
  const [searchParams] = useSearchParams();
  const [accountId, setAccountId] = useState(searchParams.get("accountId") || "");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setBalance(null);

    try {
      const response = await getBalance(accountId);
      setBalance(extractBalanceDetails(response.data));
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) handleSubmit();
  }, []);

  return (
    <section className="mx-auto max-w-2xl page-card">
      <h2 className="text-2xl font-extrabold text-slate-900">Check Balance</h2>
      <p className="mt-1 text-sm text-slate-500">
        Enter an account ID to view the current ledger balance.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="form-input"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button className="btn-primary" disabled={loading}>
          <FiDollarSign /> {loading ? "Checking..." : "Check balance"}
        </button>
      </form>

      {balance !== null && (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-bold uppercase text-emerald-700">
            Available Balance
          </p>

          <p className="mt-2 text-4xl font-extrabold text-emerald-900">
            {formatMoney(balance.amount, balance.currency)}
          </p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-white px-4 py-3">
              <p className="text-slate-500">Account ID</p>
              <p className="break-all font-semibold text-slate-900">
                {balance.accountId || accountId}
              </p>
            </div>

            <div className="rounded-lg bg-white px-4 py-3">
              <p className="text-slate-500">Currency</p>
              <p className="font-semibold text-slate-900">{balance.currency}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}