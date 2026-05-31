import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200">
        <p className="text-sm font-bold uppercase text-emerald-700">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-500">The Fincore page you requested does not exist.</p>
        <Link to="/dashboard" className="mt-6 btn-primary">Go to dashboard</Link>
      </section>
    </main>
  );
}
