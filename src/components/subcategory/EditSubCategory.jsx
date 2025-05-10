import React, { useState } from "react";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import SummaryApi from "../../common/SummaryApi";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import PathToUrl from "../utils/PathToUrl";
import uploadImage from "../utils/UploadImage";

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.category || [],
  });
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const allCategory = useSelector((state) => state.category.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setLoading(true);
    const response = await uploadImage(file, "subcategory");
    const { data: ImageResponse } = response;

    setSubCategoryData((pre) => {
      return {
        ...pre,
        image: ImageResponse.data.url,
      };
    });
    setLoading(false);
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((el) => el._id !== categoryId), // ✅ Creates a new array without the selected category
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      const response = await Axios({
        ...SummaryApi.update_subcategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          fetchData();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setAddLoading(false);
    }
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white p-4 rounded">
        <div className="flex items-center gap-3 justify-between">
          <h2 className="font-semibold">Edit Sub Category</h2>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-3 grid gap-3" onSubmit={handleSubmitSubCategory}>
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className=" border h-36 w-full lg:w-36 bg-blue-50 flex flex-col items-center justify-center">
                {subCategoryData.image ? (
                  <img
                    src={PathToUrl(subCategoryData.image)}
                    alt={subCategoryData.name}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div
                  className={`${
                    !subCategoryData.name ? "bg-gray-400" : "border-primary-200"
                  } px-4 py-2 rounded cursor-pointer border`}
                >
                  {loading ? "Loading.." : "Upload Image"}
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Select Category</label>
            <div className="border focus-within:border-primary-200 rounded">
              {/* <label htmlFor="">Select Category</label> */}

              <div className="flex flex-wrap gap-2 ">
                {subCategoryData.category?.map((cat, index) => {
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
                name=""
                id=""
                className="w-full p-2 bg-transparent outline-none border"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(
                    (el) => el._id == value
                  );
                  setSubCategoryData((pre) => {
                    if (
                      pre.category.some((el) => el._id === categoryDetails._id)
                    )
                      return pre; // Prevent duplicate categories
                    return {
                      ...pre,
                      category: [...pre.category, categoryDetails],
                    };
                  });
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((category, index) => {
                  return (
                    <option
                      value={category?._id}
                      key={category._id + "subcategory"}
                    >
                      {category?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <button
            className={`px-4 py-2 border ${
              subCategoryData.name &&
              subCategoryData.image &&
              subCategoryData.category[0]
                ? "bg-primary-blue"
                : "bg-gray-200"
            }  rounded py-2 px-2 text-white `}
          >
            {addLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;
