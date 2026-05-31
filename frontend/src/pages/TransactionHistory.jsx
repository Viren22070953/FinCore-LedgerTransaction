import { useEffect, useState } from "react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiClock,
} from "react-icons/fi";
import Loader from "../components/Loader";
import { getTransactionHistory } from "../services/transactionService";

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

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getTransactionHistory();

        setTransactions(
          response.data?.transactions ||
            response.data?.data?.transactions ||
            []
        );
      } catch (err) {
        setError(
          err?.response?.data?.message || "Unable to fetch transaction history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Transaction History
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View your credited and debited transactions.
        </p>
      </div>

      {loading && <Loader label="Loading transaction history..." />}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {!loading && transactions.length === 0 && (
        <div className="page-card text-center">
          <FiClock className="mx-auto text-slate-400" size={34} />
          <p className="mt-3 font-semibold text-slate-700">
            No transactions found.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {transactions.map((transaction) => {
          const isDebit = transaction.type === "DEBIT";

          return (
            <article key={transaction._id} className="page-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-lg ${
                      isDebit
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isDebit ? (
                      <FiArrowUpRight size={22} />
                    ) : (
                      <FiArrowDownLeft size={22} />
                    )}
                  </span>

                  <div>
                    <p className="font-bold text-slate-900">
                      {transaction.directionText}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      From: {transaction.fromUser?.name} | To:{" "}
                      {transaction.toUser?.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p
                    className={`text-xl font-extrabold ${
                      isDebit ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {isDebit ? "-" : "+"} {formatMoney(transaction.amount)}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                    {transaction.status}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                Idempotency Key:{" "}
                <span className="break-all font-semibold text-slate-700">
                  {transaction.idempotencyKey || "Not available"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}