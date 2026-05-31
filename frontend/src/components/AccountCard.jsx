import { Link } from "react-router-dom";
import { FiArrowRight, FiCreditCard } from "react-icons/fi";

export default function AccountCard({ account }) {
  const accountId = account?._id || account?.accountId || account?.id;
  const createdAt = account?.createdAt
    ? new Date(account.createdAt).toLocaleDateString()
    : "Not available";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
          <FiCreditCard size={22} />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            account?.status === "inactive" || account?.status === "closed"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {account?.status || "active"}
        </span>
      </div>
      <p className="text-xs font-semibold uppercase text-slate-500">Account ID</p>
      <h3 className="mt-1 break-all text-lg font-bold text-slate-900">{accountId}</h3>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Currency</p>
          <p className="font-semibold text-slate-900">{account?.currency || "INR"}</p>
        </div>
        <div>
          <p className="text-slate-500">Created</p>
          <p className="font-semibold text-slate-900">{createdAt}</p>
        </div>
      </div>
      <Link
        to={`/check-balance?accountId=${encodeURIComponent(accountId || "")}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        Check balance <FiArrowRight />
      </Link>
    </article>
  );
}
