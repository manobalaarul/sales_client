import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdStore } from "react-icons/md";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import Divider from "../components/design/Divider";
import MetaTags from "../components/utils/MetaTags";
import uploadImage from "../components/utils/UploadImage";
import { FaCloudUploadAlt } from "react-icons/fa";
import PathToUrl from "../components/utils/PathToUrl";
import Loading from "../components/design/Loading";

const Profile = () => {
  const [data, setData] = useState({
    company_name: "",
    address: "",
    stock: "",
    phone: "",
    gstNo: "",
    gstPer: "",
    logo: "",
  });
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const fetchData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_profile,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData({
          company_name: responseData.data.company_name || "",
          address: responseData.data.address || "",
          phone: responseData.data.phone || "",
          gstNo: responseData.data.gstNo || "",
          gstPer: responseData.data.gstPer || "",
          stock: responseData.data.stock || "",
          logo: responseData.data.logo || "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setloading(true);
    const response = await uploadImage(file, "profile");
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((prev) => ({
      ...prev,
      logo: imageUrl,
    }));

    setloading(false);
  };

  const handleDeleteImage = () => {
    setData((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.update_profile,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        // Don't reset the form after successful update
        // Instead, fetch the latest data again
        fetchData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="p-5">
      <MetaTags title={"Add Product | Stock Management"} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Profile Details</h2>
          <p className="text-sm">Update profile details</p>
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
      <Divider />
      <div className="bg-white mt-3 rounded">
        <div className="border-b flex gap-3 items-center p-2">
          <MdStore size={18} />
          <h2 className="font-semibold text-md">Profile Details</h2>
        </div>
        <div className="p-4">
          <form
            action=""
            className="lg:grid flex flex-col grid-cols-2 gap-4 lg:gap-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-2">
              <label htmlFor="company_name">Company Name</label>
              <input
                type="text"
                name="company_name"
                placeholder="Enter company name"
                id="company_name"
                onChange={handleChange}
                value={data.company_name}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                id="address"
                onChange={handleChange}
                value={data.address}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone"
                id="phone"
                onChange={handleChange}
                value={data.phone}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="gstNo">GST Number</label>
              <input
                type="text"
                name="gstNo"
                placeholder="Enter gstNo"
                id="gstNo"
                onChange={handleChange}
                value={data.gstNo}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid col-span-2 gap-2">
              <label htmlFor="gstPer">GST Percentage %</label>
              <input
                type="text"
                name="gstPer"
                placeholder="Enter gstPer"
                id="gstPer"
                onChange={handleChange}
                value={data.gstPer}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid col-span-2">
              <p>Image</p>
              <div>
                <label
                  htmlFor="productImage"
                  className="h-24 border flex items-center justify-center cursor-pointer"
                >
                  <div className="flex justify-center items-center flex-col">
                    {loading ? (
                      <Loading />
                    ) : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="productImage"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                </label>
                {data.logo && (
                  <div className="h-20 w-80 mt-2 min-w-20 border cursor-pointer relative group">
                    <img
                      src={PathToUrl(data.logo)}
                      alt="logo"
                      className="h-full w-full object-cover"
                    />
                    <div
                      onClick={handleDeleteImage}
                      className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-900 rounded text-white hidden group-hover:block"
                    >
                      <MdDelete />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <button className="bg-primary-blue rounded py-2 px-2 text-white w-full">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
