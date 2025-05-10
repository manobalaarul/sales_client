import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalContext } from "../../provider/GlobalProvider";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const { handleLogout } = useGlobalContext();
  return (
    <div className="relative">
      {/* User Icon */}
      <div
        className="bg-gray-300 px-2 py-2 flex items-center justify-center rounded cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaUser />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          {user?._id ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth/login"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
