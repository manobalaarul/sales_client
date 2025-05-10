import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import func from "./components/utils/fetchUserItems";
import GlobalProvider from "./provider/GlobalProvider";
import { setAllCategory, setAllSubCategory } from "./store/categorySlice";
import { setProfileDetails } from "./store/profileSlice";
const App = () => {
  const dispatch = useDispatch();

  const fetchGeneralData = async () => {
    try {
      const fetchCategory = await func.fetchAllCategory();
      dispatch(setAllCategory(fetchCategory.data));

      const fetchSubCategory = await func.fetchAllSubCategory();
      dispatch(setAllSubCategory(fetchSubCategory.data));

      const fetchProfileDetails = await func.fetchProfileDetails();
      dispatch(setProfileDetails(fetchProfileDetails.data));
    } catch (error) {
      console.error("Error fetching general data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const localuser = localStorage.getItem("accessToken");
      if (localuser) {
        const userData = await func.fetchUserDetails();
        console.log(userData);

        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  useEffect(() => {
    fetchGeneralData();
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserData();
    }
  }, [localStorage.getItem("accessToken")]); // ✅ Re-fetch on token change

  return (
    <GlobalProvider>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </GlobalProvider>
  );
};

export default App;
