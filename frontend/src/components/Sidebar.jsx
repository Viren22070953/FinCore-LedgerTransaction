import { NavLink } from "react-router-dom";
import {
  FiCreditCard,
  FiDollarSign,
  FiGrid,
  FiHome,
  FiPlusCircle,
  FiRepeat,
  FiShield,
  FiX,
  FiClock
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/accounts", label: "My Accounts", icon: FiCreditCard },
  { to: "/create-account", label: "Create Account", icon: FiPlusCircle },
  { to: "/check-balance", label: "Check Balance", icon: FiDollarSign },
  { to: "/transfer-money", label: "Transfer Money", icon: FiRepeat },
  {to: "/transaction-history",label: "History",icon: FiClock,}
];

export default function Sidebar({ open, onClose }) {
  const { isSystemUser } = useAuth();
  const items = isSystemUser
    ? [...navItems, { to: "/initial-funds", label: "Initial Funds", icon: FiShield }]
    : navItems;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B1F3A] text-white transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500">
              <FiHome />
            </span>
            <span>
              <span className="block text-lg font-bold">Fincore</span>
              <span className="text-xs text-slate-300">Banking ledger</span>
            </span>
          </NavLink>
          <button type="button" onClick={onClose} className="rounded-lg p-2 lg:hidden">
            <FiX size={20} />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-5">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
