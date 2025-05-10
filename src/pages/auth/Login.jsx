import React, { useState } from "react";
import bgImg from "../../assets/auth/login-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../components/utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../../components/utils/AxiosToastError";
import SummaryApi from "../../common/SummaryApi";
import { useDispatch } from "react-redux";
import func from "../../components/utils/fetchUserItems";
import { setUserDetails } from "../../store/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return { ...pre, [name]: value };
    });
  };

  const validateValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);

        // Store tokens
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        // Fetch user details **immediately** after login
        const userDetails = await func.fetchUserDetails();

        if (userDetails?.data) {
          dispatch(setUserDetails(userDetails.data)); // ✅ Dispatch correct data
        } else {
          toast.error("Failed to fetch user details.");
        }

        // Navigate after updating user details
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

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
          <h2 className="font-bold text-2xl">Sign In</h2>
          <p>
            Access your Stock Management panel using your email and password.
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
            <Link
              to={"/auth/forgot_password"}
              className="text-primary-blue text-right"
            >
              Forgot Password
            </Link>
          </div>
          <button className="bg-primary-blue rounded py-2 text-white mt-5">
            Sign In
          </button>
        </form>
        <div className="flex mt-5 justify-center">
          <p className="mr-3">I don't have an account?</p>
          <Link to={"/auth/register"} className="text-primary-blue">
            Register here
          </Link>
        </div>
        <div className="flex mt-10 justify-center">
          <p className="mr-3">Copyright © 2025 Mano Codes</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
