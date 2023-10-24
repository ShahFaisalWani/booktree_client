import "./App.css";
import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  createContext,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingScreen from "./components/Loading/LoadingScreen";
import StationeriesPage from "./pages/StationeriesPage";
import SpecialBooks from "./pages/SpecialBooks";
import Cookies from "js-cookie";
import axios from "axios";

axios.defaults.withCredentials = true;

const AdminNav = lazy(() => import("./components/Admin/AdminNav"));
const Navbar = lazy(() => import("./components/Navbar/Navbar.jsx"));
const PrivateRoutes = lazy(() => import("./utils/PrivateRoutes"));
const AdminRoutes = lazy(() => import("./utils/AdminRoutes"));
const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SearchResult = lazy(() => import("./pages/SearchResult"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const UserPage = lazy(() => import("./pages/UserPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminDashboard = lazy(() =>
  import("./components/Admin/Dashboard/AdminDashboard")
);

const Router = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route element={<Checkout />} path="/checkout" />
        <Route element={<UserPage />} path="/user/:path" />
      </Route>

      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<Home />} path="/" />
      <Route element={<SearchResult />} path="/search" />
      <Route element={<BooksPage />} path="/books" />
      <Route element={<SpecialBooks />} path="/books/:type" />
      <Route element={<StationeriesPage />} path="/stationeries" />

      <Route element={<AdminRoutes />}>
        <Route element={<AdminDashboard />} path="/admin" />
        <Route element={<AdminPage />} path="/admin/:path/" />
      </Route>
    </Routes>
  );
};

export const SortContext = createContext();

function App() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [type, setType] = useState({
    label: "ค่าตั้งต้น",
    sort: "default",
    way: 0,
  });

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [location]);

  const adminToken = Cookies.get("admin-token");

  return (
    <>
      {isAdmin ? adminToken && <AdminNav /> : <Navbar />}
      <div className="App">
        <Suspense fallback={<LoadingScreen />}>
          <SortContext.Provider value={{ type, setType }}>
            <Router />
          </SortContext.Provider>
        </Suspense>
      </div>
    </>
  );
}

export default App;
