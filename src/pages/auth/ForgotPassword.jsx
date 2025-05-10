import React, { useState } from "react";
import ForgotPasswordImg from "../../assets/auth/forgot-password-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../components/utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../components/utils/AxiosToastError";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return { ...pre, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth/verify_reset_password", {
          state: data,
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section
      className="bg-no-repeat bg-cover bg-center h-[100vh]"
      style={{ backgroundImage: `url(${ForgotPasswordImg})` }}
    >
      {/* Blurred Form Background */}
      <div className="lg:w-1/2 h-full bg-white bg-opacity-70 backdrop-blur-lg py-10 lg:px-20 px-5 shadow-lg">
        <h2 className="text-center font-bold text-3xl py-5">
          Stock Management
        </h2>
        <div className="py-5">
          <h2 className="font-bold text-2xl">Forgot Password ?</h2>
          <p className="mt-2">
            If you forgot your password, well, then we’ll email you instructions
            to reset your password.
          </p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              id="email"
              onChange={handleChange}
              value={data.email}
              className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
          <button className="bg-primary-blue rounded py-2 text-white mt-5">
            Send Otp
          </button>
        </form>
        <div className="flex mt-5 justify-center">
          <p className="mr-3">Return to</p>
          <Link to={"/auth/login"} className="text-primary-blue">
            Login
          </Link>
        </div>
        <div className="flex mt-10 justify-center">
          <p className="mr-3">Copyright © 2025 Mano Codes</p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
