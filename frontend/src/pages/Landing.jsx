import { Link } from "react-router-dom";
import { FiArrowRight, FiLock, FiRefreshCw, FiShield } from "react-icons/fi";

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-extrabold text-[#0B1F3A]">
          Fincore
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary px-4 py-2">
            Login
          </Link>
          <Link to="/register" className="btn-primary px-4 py-2">
            Register
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <span className="mb-5 w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            Secure banking ledger platform
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
            Modern account management with reliable money movement.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Register, create accounts, check balances, transfer funds, and keep
            every credit and debit backed by ledger entries and idempotent
            transaction requests.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">
              Open an account <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary">
              Access dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0B1F3A] p-6 text-white shadow-2xl shadow-slate-300">
          <div className="rounded-xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-300">Portfolio Balance</p>
            <p className="mt-3 text-4xl font-extrabold">₹82,450.00</p>
            <div className="mt-6 grid gap-3">
              {[
                ["Primary Savings", "+ ₹12,500.00", "text-emerald-300"],
                ["Vendor Transfer", "- ₹4,200.00", "text-red-300"],
                ["Ledger Verified", "Idempotent", "text-slate-200"],
              ].map(([label, amount, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-slate-700">{label}</span>
                  <span className={`font-bold ${color}`}>{amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [FiShield, "Protected sessions"],
              [FiRefreshCw, "Safe transfers"],
              [FiLock, "Ledger integrity"],
            ].map(([Icon, label]) => (
              <div key={label} className="rounded-xl bg-white/10 p-4">
                <Icon className="mb-3 text-emerald-300" size={22} />
                <p className="text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
