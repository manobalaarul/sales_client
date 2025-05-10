import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import uploadImage from "../utils/UploadImage";
import PathToUrl from "../utils/PathToUrl";

const EditCategory = ({ close, fetchData, data: categoryData }) => {
  const [data, setData] = useState({
    _id: categoryData._id,
    name: categoryData.name,
    image: categoryData.image,
  });
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUploadLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploadLoading(true);
      const response = await Axios({
        ...SummaryApi.update_category,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setLoading(true);

    const response = await uploadImage(file, "category");
    const { data: ImageResponse } = response;
    setLoading(false);

    setData((pre) => {
      return {
        ...pre,
        image: ImageResponse.data.url,
      };
    });
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Edit Category</h2>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <form action="" className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              name="name"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              onChange={handleOnChange}
              className="bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 lg:w-36 w-full flex items-center justify-center rounded">
                {data.image ? (
                  <img
                    src={PathToUrl(data.image)}
                    alt={data.name}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
                <div
                  className={`${
                    !data.name ? "bg-gray-400" : "border-primary-200"
                  } px-4 py-2 rounded cursor-pointer border`}
                >
                  {loading ? "Loading..." : "Upload Image"}
                </div>
              </label>
            </div>
            <button
              className={`${
                data.name && data.image ? "bg-primary-blue" : "bg-gray-400"
              }  rounded py-2 text-white mt-5`}
            >
              {updateLoading ? "Loading..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
