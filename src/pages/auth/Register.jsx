import React, { useState } from "react";
import bgImg from "../../assets/auth/login-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../components/utils/AxiosToastError";
import Axios from "../../components/utils/Axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
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

    if (data.password !== data.confirm_password) {
      toast.error("password and confirm password must be same ");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/auth/login");
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
      <div className="float-right lg:w-1/2 overflow-y-scroll h-full scrollBarCustom bg-white bg-opacity-70 backdrop-blur-lg py-5 lg:px-20 px-5 shadow-lg">
        <h2 className="text-center font-bold text-3xl py-5">
          Stock Management
        </h2>
        <div className="py-5">
          <h2 className="font-bold text-2xl">Sign Up</h2>
          <p>Create an account to access your Stock Management panel.</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              id="name"
              onChange={handleChange}
              value={data.name}
              className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
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
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm your password"
              id="confirm_password"
              onChange={handleChange}
              value={data.confirm_password}
              className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
          <button
            disabled={!validateValue}
            className={` rounded py-2 text-white mt-5 ${
              data.name && data.email && data.password
                ? "bg-primary-blue"
                : "bg-gray-400"
            }`}
          >
            Sign In
          </button>
        </form>
        <div className="flex mt-5 justify-center">
          <p className="mr-3">I already have an account?</p>
          <Link to={"/auth/login"} className="text-primary-blue">
            Login here
          </Link>
        </div>
        <div className="flex mt-10 justify-center">
          <p className="mr-3">Copyright © 2025 Mano Codes</p>
        </div>
      </div>
    </section>
  );
};

export default Register;
