import { Link, useLocation } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiList,
  FiPlusCircle,
} from "react-icons/fi";

const findAccount = (response) =>
  response?.account ||
  response?.newAccount ||
  response?.createdAccount ||
  response?.data?.account ||
  response?.data?.newAccount ||
  response?.data?.createdAccount ||
  response?.data ||
  null;

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

export default function AccountCreated() {
  const { state } = useLocation();

  if (!state) {
    return (
      <section className="mx-auto max-w-2xl page-card text-center">
        <h2 className="text-2xl font-extrabold text-slate-900">
          No Account Details
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Create an account first to see the account summary.
        </p>

        <Link to="/create-account" className="mt-6 btn-primary">
          <FiPlusCircle /> Create account
        </Link>
      </section>
    );
  }

  const isSuccess = state.status === "success";
  const account = findAccount(state.response) || {};
  const request = state.request || {};

  const accountId =
    account.accountId ||
    account._id ||
    account.id ||
    state.response?.accountId ||
    state.response?._id ||
    "Not available";

  const currency =
    account.currency || state.response?.currency || request.currency || "INR";

  const accountType =
    account.accountType ||
    account.type ||
    state.response?.accountType ||
    request.accountType ||
    "Not available";

  const status = account.status || state.response?.status || "active";

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          isSuccess
            ? "border-emerald-100 bg-emerald-50"
            : "border-red-100 bg-red-50"
        }`}
      >
        <div className="flex gap-4">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
              isSuccess ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
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
              {isSuccess ? "Account Created" : "Account Creation Failed"}
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              {state.message}
            </h2>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
            <FiCreditCard size={22} />
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Account Details
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Account ID" value={accountId} />
          <Detail label="Currency" value={currency} />
          <Detail label="Account Type" value={accountType} />
          <Detail label="Status" value={status} />
          <Detail label="Created At" value={formatDate(account.createdAt)} />
          <Detail
            label="Opening Balance"
            value={
              account.balance !== undefined
                ? `${currency} ${account.balance}`
                : "Not available"
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/accounts" className="btn-secondary">
          <FiList /> My Accounts
        </Link>

        {isSuccess && accountId !== "Not available" && (
          <Link
            to={`/check-balance?accountId=${encodeURIComponent(accountId)}`}
            className="btn-secondary"
          >
            <FiDollarSign /> Check Balance
          </Link>
        )}

        <Link to="/create-account" className="btn-primary">
          <FiPlusCircle /> Create Another Account
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