import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import DashboardLayout from "../pages/layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import AuthLayout from "../pages/layouts/AuthLayout";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import VerifyResetPassword from "../pages/auth/VerifyResetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import AddProduct from "../pages/AddProduct";
import Products from "../pages/Products";
import EditProduct from "../pages/EditProduct";
import StockDetails from "../pages/StockDetails";
import InStockDetails from "../pages/InStockDetails";
import Sales from "../pages/Sale";
import OutStockDetails from "../pages/OutStockDetails";
import OrderDetails from "../pages/OrderDetails";
import InvoicePage from "../pages/InvoicePage";
import InvoicePagePrint from "../pages/InvoicePagePrint";
import Profile from "../pages/Profile";

const router = createBrowserRouter(
  [
    {
      path: "",
      element: <App />,
      children: [
        {
          path: "",
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "category",
              element: <Category />,
            },
            {
              path: "sub_category",
              element: <SubCategory />,
            },
            {
              path: "add_products",
              element: <AddProduct />,
            },
            {
              path: "edit_product",
              element: <EditProduct />,
            },
            {
              path: "products",
              element: <Products />,
            },
            {
              path: "stock_details",
              element: <StockDetails />,
            },
            {
              path: "instock_details",
              element: <InStockDetails />,
            },
            {
              path: "outstock_details",
              element: <OutStockDetails />,
            },
            {
              path: "sales",
              element: <Sales />,
            },
            {
              path: "order_details",
              element: <OrderDetails />,
            },
            {
              path: "invoice",
              element: <InvoicePage />,
            },
            {
              path: "invoice_print",
              element: <InvoicePage />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
          ],
        },
        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
            {
              path: "forgot_password",
              element: <ForgotPassword />,
            },
            {
              path: "verify_email",
              element: <VerifyEmail />,
            },
            {
              path: "verify_reset_password",
              element: <VerifyResetPassword />,
            },
            {
              path: "reset_password",
              element: <ResetPassword />,
            },
          ],
        },
      ],
    },
  ],
);

export default router;
