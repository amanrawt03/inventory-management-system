import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddItemsPage from "./pages/AddItemsPage";
import SellItemsPage from "./pages/SellItemsPage";
import CategoryList from "./lists/CategoryList";
import SuppliersList from "./lists/SuppliersList";
import ItemsList from "./lists/ItemsList";
import LocationsList from "./lists/LocationsList";
import { ToastContainer, toast } from "react-toastify";
import PurchaseTransactionPage from "./pages/PurchaseTransactionPage";
import Layout from "./components/Layout";
import SellTransactionPage from "./pages/SellTransactionPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
function App() {
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
            path="/list/Categories"
            element={<CategoryList showToast={showToast} />}
          />
          <Route
            path="/list/Suppliers"
            element={<SuppliersList showToast={showToast} />}
          />
          <Route
            path="/list/Items"
            element={<ItemsList showToast={showToast} />}
          />
          <Route
            path="/list/Locations"
            element={<LocationsList showToast={showToast} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage showToast={showToast} />}
          />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
