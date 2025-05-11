import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { BiSolidTruck } from "react-icons/bi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  MdAddShoppingCart,
  MdPerson,
  MdShoppingBag,
  MdStackedBarChart,
} from "react-icons/md";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import MetaTags from "../components/utils/MetaTags";

const Home = () => {
  // Define ApexCharts data
  const [data, setData] = useState([]);
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      zoom: { enabled: true },
    },
    title: {
      text: "Sales Performance",
      align: "left",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: { text: "Revenue (₹)" },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
  };

  const chartSeries = [
    {
      name: "Sales",
      data: data.salesData,
    },
  ];

  const dashboardData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.todays_report,
      });
      const { data: responseData } = response;
      setData(responseData.data);
    } catch (error) {
      AxiosToastError(error);
    }
  };
  useEffect(() => {
    dashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <MetaTags title={"Home | Stock Management"} />
      <div className="flex-1 p-6">
        {/* Top Stats */}
        <h2 className="text-xl font-bold mb-4">Today's Report</h2>
        <div className="flex flex-col lg:grid grid-cols-4 gap-4">
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MdShoppingBag className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Total Sales
              </h2>
              <p className="text-xl font-bold text-gray-900">
                {data.totalSalesQty}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BiSolidTruck className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Confirm Orders
              </h2>
              <p className="text-xl font-bold text-gray-900">
                {data.totalConfirmedOrders}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BiSolidTruck className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Saved Orders
              </h2>
              <p className="text-xl font-bold text-gray-900">
                {data.totalSavedOrders}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaIndianRupeeSign className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">Revenue</h2>
              <p className="text-xl font-bold text-gray-900">
                {data.totalSales}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold my-4">General Report</h2>
        <div className="flex flex-col lg:grid grid-cols-3 gap-4">
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MdPerson className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">Users</h2>
              <p className="text-xl font-bold text-gray-900">
                {data.totalUsers}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MdStackedBarChart className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Limited Stocks
              </h2>
              <p className="text-xl font-bold text-gray-900">
                {data.lowStockCount}
              </p>
            </div>
          </div>
          <div className="bg-white border-2 p-4 flex gap-6 items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MdAddShoppingCart className="w-8 h-8 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Out of Stock
              </h2>
              <p className="text-xl font-bold text-gray-900">
                {data.outOfStockCount}
              </p>
            </div>
          </div>
        </div>

        {/* Sales Chart (ApexCharts) */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Sales Chart</h2>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
