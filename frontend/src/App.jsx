import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddItemsPage from "./pages/AddItemsPage";
import SellItemsPage from "./pages/SellItemsPage";
import { ToastContainer, toast } from "react-toastify";
import PurchaseTransactionPage from "./pages/PurchaseTransactionPage";
import Layout from "./components/Layout";
import SellTransactionPage from "./pages/SellTransactionPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";
import NotificationsPage from "./pages/NotificationsPage";
import useGoogleAuthListener from "./hooks/useGoogleAuthListener";
function App() {
  useGoogleAuthListener();
  const showToast = () => {
    toast.success("This is a success message!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage showToast={showToast} />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword showToast={showToast} />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword showToast={showToast} />}
        />
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage showToast={showToast} />} />
          <Route
            path="/addItems"
            element={<AddItemsPage showToast={showToast} />}
          />
          <Route
            path="/sellItems"
            element={<SellItemsPage showToast={showToast} />}
          />
          <Route
            path="/sellTransactions"
            element={<SellTransactionPage showToast={showToast} />}
          />
          <Route
            path="/purchaseTransactions"
            element={<PurchaseTransactionPage showToast={showToast} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage showToast={showToast} />}
          />
          <Route
            path="/changePassword"
            element={<ChangePassword showToast={showToast} />}
          />
          <Route
            path="/notifications"
            element={<NotificationsPage showToast={showToast} />}
          />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
