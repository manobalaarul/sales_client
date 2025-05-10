import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../components/utils/AxiosToastError";
import toast from "react-hot-toast";
import { logout } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.clear();
        localStorage.clear();
        dispatch(logout());
        navigate("/auth/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        handleLogout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
