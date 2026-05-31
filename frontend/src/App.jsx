import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import CreateAccount from "./pages/CreateAccount";
import CheckBalance from "./pages/CheckBalance";
import TransferMoney from "./pages/TransferMoney";
import TransactionResult from "./pages/TransactionResult";
import InitialFunds from "./pages/InitialFunds";
import AccountCreated from "./pages/AccountCreated";
import TransactionHistory from "./pages/TransactionHistory";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/account-created" element={<AccountCreated />} />
          <Route path="/check-balance" element={<CheckBalance />} />
          <Route path="/transfer-money" element={<TransferMoney />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/transaction-result" element={<TransactionResult />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute systemOnly />}>
        <Route element={<AppLayout />}>
          <Route path="/initial-funds" element={<InitialFunds />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}