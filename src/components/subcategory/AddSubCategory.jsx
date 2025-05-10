import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import uploadImage from "../utils/UploadImage";
import PathToUrl from "../utils/PathToUrl";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddSubCategory = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
    category: [],
  });
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const allCategories = useSelector((state) => state.category.allCategory);
  console.log(allCategories);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleRemoveCategorySelected = (categoryId) => {
    const index = data.category.findIndex((el) => el._id === categoryId);

    data.category.splice(index, 1);
    setData((pre) => {
      return {
        ...pre,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setAddLoading(true);
      const response = await Axios({
        ...SummaryApi.add_subcategory,
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
      setAddLoading(false);
    }
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setLoading(true);
    const response = await uploadImage(file, "subcategory");
    const { data: ImageResponse } = response;

    setData((pre) => {
      return {
        ...pre,
        image: ImageResponse.data.url,
      };
    });
    setLoading(false);
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Sub Category</h2>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <form action="" className="my-3 grid gap-3" onSubmit={handleSubmit}>
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
                  onChange={handleUploadSubCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
                <div
                  className={`${
                    !data.name ? "bg-gray-400" : "border-primary-200"
                  } px-4 py-2 rounded cursor-pointer border`}
                >
                  {loading ? "Loading.." : "Upload Image"}
                </div>
              </label>
            </div>
            <div className="grid">
              <label htmlFor="categoryName">Category</label>
              <div className="flex flex-wrap gap-2 ">
                {data.category?.map((cat, index) => {
                  return (
                    <div
                      className="bg-white shadow-md flex items-center gap-2 px-1 m-1"
                      key={cat._id + "selectedvalue"}
                    >
                      {cat.name}
                      <div
                        className="cursor-pointer"
                        onClick={() => handleRemoveCategorySelected(cat._id)}
                      >
                        <IoClose className="hover:text-red-500" size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <select
                name="category"
                id="subCategoryName"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategories.find(
                    (el) => el._id == value
                  );
                  setData((pre) => {
                    return {
                      ...pre,
                      category: [...pre.category, categoryDetails],
                    };
                  });
                }}
                className="bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
              >
                {allCategories.map((cate, index) => {
                  return (
                    <option key={cate._id + "subcategory"} value={cate._id}>
                      {cate.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              className={`${
                data.name && data.image ? "bg-primary-blue" : "bg-gray-400"
              } rounded py-2 px-2 text-white`}
            >
              {addLoading ? "Loading..." : "  Add Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddSubCategory;
