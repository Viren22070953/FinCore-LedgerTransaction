import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCreditCard, FiDollarSign, FiPlusCircle, FiRepeat } from "react-icons/fi";
import AccountCard from "../components/AccountCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getMyAccounts } from "../services/accountService";

const normalizeAccounts = (data) =>
  data?.allAccounts || data?.accounts || data?.data?.accounts || data?.data || [];
export default function Dashboard() {
  const { user, logout } = useAuth();
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

  const actions = [
    { to: "/create-account", label: "Create Account", icon: FiPlusCircle },
    { to: "/accounts", label: "My Accounts", icon: FiCreditCard },
    { to: "/check-balance", label: "Check Balance", icon: FiDollarSign },
    { to: "/transfer-money", label: "Transfer Money", icon: FiRepeat },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[#0B1F3A] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-300">Welcome user</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold">{user?.name || user?.email || "Fincore User"}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Manage your accounts, balances, and ledger-safe money transfers from one dashboard.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-5 py-4">
            <p className="text-sm text-slate-300">Total accounts</p>
            <p className="text-3xl font-extrabold">{accounts.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="page-card flex items-center gap-4 hover:border-emerald-200 hover:shadow-md">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
              <Icon size={22} />
            </span>
            <span className="font-bold text-slate-900">{label}</span>
          </Link>
        ))}
        <button onClick={logout} className="page-card flex items-center gap-4 text-left hover:border-red-200 hover:shadow-md">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-red-50 text-red-700">
            <FiRepeat size={22} />
          </span>
          <span className="font-bold text-slate-900">Logout</span>
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Account cards</h3>
          <Link to="/accounts" className="text-sm font-bold text-emerald-700">View all</Link>
        </div>
        {loading ? <Loader label="Loading accounts..." /> : null}
        {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {!loading && accounts.length === 0 ? (
          <div className="page-card text-center">
            <p className="font-semibold text-slate-700">No accounts yet.</p>
            <Link to="/create-account" className="mt-4 btn-primary">Create your first account</Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.slice(0, 6).map((account) => (
              <AccountCard key={account?._id || account?.accountId || account?.id} account={account} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
