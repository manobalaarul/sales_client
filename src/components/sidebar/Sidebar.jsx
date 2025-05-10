import {
  FaDashcube,
  FaJediOrder,
  FaShippingFast,
  FaTruckLoading,
  FaUser,
} from "react-icons/fa";
import {
  MdClose,
  MdDashboard,
  MdDashboardCustomize,
  MdFireTruck,
  MdInterests,
  MdInventory,
  MdStore,
  MdViewColumn,
  MdViewList,
} from "react-icons/md";
import { FaCartShopping, FaTruckFast } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  return (
    <div
      className={`fixed bg-white top-0 left-0 w-64 shadow-md min-h-screen p-4 transform z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform md:relative md:translate-x-0 overflow-hidden`}
    >
      {/* Close Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 right-4 text-xl"
      >
        <MdClose />
      </button>

      {/* Profile Section */}
      <div className="border-b gap-2 p-2">
        <div>
          <p className="text-xl font-semibold pb-3">Stock Management</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              to={"/"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to={"/sales"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/sales"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdInventory /> Sales
            </Link>
          </li>
          <li>
            <Link
              to={"/category"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/category"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdViewList /> Category
            </Link>
          </li>
          <li>
            <Link
              to={"/sub_category"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/sub_category"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdViewColumn /> Sub Category
            </Link>
          </li>
          <li>
            <Link
              to={"/add_products"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/add_products"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdStore />
              Add Products
            </Link>
          </li>
          <li>
            <Link
              to={"/products"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/products"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdInterests />
              Products
            </Link>
          </li>
          <li>
            <Link
              to={"/stock_details"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/stock_details"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <MdFireTruck />
              Stock Details
            </Link>
          </li>
          <li>
            <Link
              to={"/instock_details"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/instock_details"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaTruckLoading />
              InStock Details
            </Link>
          </li>
          <li>
            <Link
              to={"/outstock_details"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/outstock_details"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaTruckFast />
              OutStock Details
            </Link>
          </li>
          <li>
            <Link
              to={"/order_details"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/order_details"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaCartShopping />
              Order Details
            </Link>
          </li>
          <li>
            <Link
              to={"/profile"}
              onClick={toggleSidebar}
              className={`p-2 rounded flex items-center gap-3 ${
                location.pathname === "/profile"
                  ? "bg-primary-blue text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaUser />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
