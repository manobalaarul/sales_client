import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../../components/utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../components/utils/AxiosToastError";
import bgImg from "../../assets/auth/login-img.jpg";

const ResetPassword = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return { ...pre, [name]: value };
    });
  };
  useEffect(() => {
    if (location.state?.email) {
      setData((pre) => {
        return {
          ...pre,
          email: location?.state?.email,
        };
      });
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.reset_password,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth/login");
        setData({
          email: "",
          password: "",
          confirm_password: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const validateValue = Object.values(data).every((el) => el);

  return (
    <section
      className="bg-no-repeat bg-cover bg-center h-[100vh]"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Blurred Form Background */}
      <div className="lg:w-1/2 h-full bg-white bg-opacity-70 backdrop-blur-lg py-10 lg:px-20 px-5 shadow-lg">
        <h2 className="text-center font-bold text-3xl py-5">
          Stock Management
        </h2>
        <div className="py-5">
          <h2 className="font-bold text-2xl">Reset you Password</h2>
          <p>Enter new password to continue.</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2 mt-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              id="password"
              onChange={handleChange}
              value={data.password}
              className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
          <div className="grid gap-2 mt-4">
            <label htmlFor="confirm_password">Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="confirm your password"
              id="confirm_password"
              onChange={handleChange}
              value={data.confirm_password}
              className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
          <button className="bg-primary-blue rounded py-2 text-white mt-5">
            Submit
          </button>
        </form>
        <div className="flex mt-10 justify-center">
          <p className="mr-3">Copyright © 2025 Mano Codes</p>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
