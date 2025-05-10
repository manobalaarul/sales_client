import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../../components/utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../components/utils/AxiosToastError";
import bgImg from "../../assets/auth/login-img.jpg";
import toast from "react-hot-toast";

const VerifyResetPassword = () => {
  const [data, setData] = useState({
    otp: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.verify_password,
        data: {
          email: location.state?.email,
          otp: data.otp,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth/reset_password", {
          state: { email: location.state?.email },
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
          <h2 className="font-bold text-2xl">Verify your Email</h2>
          <p>Enter an OTP received to yopur email.</p>
        </div>
        <form
          action=""
          className="grid gap-5"
          method="post"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-2">
            <label htmlFor="email">Otp</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter your otp"
              id="otp"
              value={data.otp}
              onChange={handleChange}
              className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
          <button
            disabled={!validateValue}
            className="bg-primary-blue rounded py-2 text-white mt-5"
          >
            Verify Otp
          </button>
        </form>
        <div className="flex mt-10 justify-center">
          <p className="mr-3">Copyright © 2025 Mano Codes</p>
        </div>
      </div>
    </section>
  );
};

export default VerifyResetPassword;
