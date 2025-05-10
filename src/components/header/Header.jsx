import React from "react";
import { MdMenu, MdNotifications, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import FullScreenButton from "./FullScreenButton";
import { FaSearch } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="relative w-full max-w-xs hidden lg:block">
        <input
          type="text"
          placeholder="Search for keyword"
          className="bg-transparent p-1.5 pl-10 border border-primary-blue rounded focus:outline-none w-full"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-blue" />
      </div>
      <div className="flex gap-2 justify-between w-full">
        <div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-2xl border border-primary-blue rounded px-2 py-1"
          >
            <MdMenu />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <FullScreenButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
