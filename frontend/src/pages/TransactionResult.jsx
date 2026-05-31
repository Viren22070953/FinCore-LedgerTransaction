import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiCopy,
  FiRepeat,
} from "react-icons/fi";

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

export default function TransactionResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <section className="mx-auto max-w-2xl page-card text-center">
        <h2 className="text-2xl font-extrabold text-slate-900">
          No Transaction Details
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Submit a transfer first to see the transaction summary.
        </p>

        <Link to="/transfer-money" className="mt-6 btn-primary">
          Start transfer
        </Link>
      </section>
    );
  }

  const isSuccess = state.status === "success";
  const details = state.details || {};
  const response = state.response || {};

  const transactionId =
    response.transactionId ||
    response.transaction?._id ||
    response.transaction?.id ||
    response.data?.transactionId ||
    response.data?.transaction?._id ||
    "Not available";

  const copyKey = async () => {
    if (details.idempotencyKey) {
      await navigator.clipboard.writeText(details.idempotencyKey);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          isSuccess
            ? "border-emerald-100 bg-emerald-50"
            : "border-red-100 bg-red-50"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                isSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {isSuccess ? (
                <FiCheckCircle size={26} />
              ) : (
                <FiAlertCircle size={26} />
              )}
            </span>

            <div>
              <p
                className={`text-sm font-bold uppercase ${
                  isSuccess ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {isSuccess ? "Transaction Completed" : "Transaction Failed"}
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                {state.message}
              </h2>
            </div>
          </div>

          <p className="rounded-lg bg-white px-4 py-3 text-right text-2xl font-extrabold text-slate-900">
            {formatMoney(details.amount)}
          </p>
        </div>
      </div>

      <div className="page-card">
        <h3 className="text-lg font-extrabold text-slate-900">
          Transaction Details
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Detail label="From Account" value={details.fromAccount} />
          <Detail label="To Account" value={details.toAccount} />
          <Detail label="Amount" value={formatMoney(details.amount)} />
          <Detail label="Transaction ID" value={transactionId} />
          <Detail label="Requested At" value={formatDate(details.requestedAt)} />

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Idempotency Key
            </p>

            <div className="mt-2 flex items-center gap-2">
              <p className="min-w-0 flex-1 break-all text-sm font-semibold text-slate-900">
                {details.idempotencyKey || "Not available"}
              </p>

              <button
                type="button"
                onClick={copyKey}
                className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-emerald-700"
                aria-label="Copy idempotency key"
              >
                <FiCopy />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          <FiArrowLeft /> Back
        </button>

        <Link to="/transfer-money" className="btn-primary">
          <FiRepeat /> New transfer
        </Link>
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm font-semibold text-slate-900">
        {value || "Not available"}
      </p>
    </div>
  );
}