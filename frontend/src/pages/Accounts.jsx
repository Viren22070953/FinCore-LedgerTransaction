import { useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import Loader from "../components/Loader";
import { getMyAccounts } from "../services/accountService";

const normalizeAccounts = (data) =>
  data?.allAccounts || data?.accounts || data?.data?.accounts || data?.data || [];

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getMyAccounts();
        setAccounts(normalizeAccounts(response.data));
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load accounts.");
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">My Accounts</h2>
        <p className="mt-1 text-sm text-slate-500">Only accounts owned by the logged-in user are shown.</p>
      </div>
      {loading && <Loader label="Fetching your accounts..." />}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      {!loading && accounts.length === 0 && (
        <div className="page-card text-center font-semibold text-slate-600">No accounts found.</div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account?._id || account?.accountId || account?.id} account={account} />
        ))}
      </div>
    </div>
  );
}
