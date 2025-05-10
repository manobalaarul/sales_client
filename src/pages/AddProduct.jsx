import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  MdBarChart,
  MdBarcodeReader,
  MdClose,
  MdDelete,
  MdPropane,
  MdQrCode,
  MdRefresh,
  MdStore,
  MdViewColumn,
  MdVisibility,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AxiosToastError from "../components/utils/AxiosToastError";
import uploadImage from "../components/utils/UploadImage";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaCloudUploadAlt } from "react-icons/fa";
import Loading from "../components/design/Loading";
import Divider from "../components/design/Divider";
import PathToUrl from "../components/utils/PathToUrl";
import { IoClose } from "react-icons/io5";
import MetaTags from "../components/utils/MetaTags";
import Barcode from "react-barcode";

const AddProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    sub_category: [],
    unit: "",
    stock: "",
    actual_price: "",
    selling_price: "",
    bar_code: "",
    description: "",
    publish: "",
  });
  const [showBarCode, setShowBarCode] = useState(false);
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [openImageUrl, setOpenImageUrl] = useState("");
  const allCategory = useSelector((state) => state.category.allCategory);
  const allSubCategory = useSelector((state) => state.category.allSubCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setloading(true);
    const response = await uploadImage(file, "product");
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl],
      };
    });
    setloading(false);
  };

  const handleDeleteImage = async (index) => {
    const updatedImages = data.image.filter((_, i) => i !== index);
    setData((prev) => ({
      ...prev,
      image: updatedImages,
    }));
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

  const handleRemoveSubCategorySelected = (categoryId) => {
    const index = data.sub_category.findIndex((el) => el._id === categoryId);

    data.sub_category.splice(index, 1);
    setData((pre) => {
      return {
        ...pre,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading1(true);
      const response = await Axios({
        ...SummaryApi.add_product,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setloading1(false);
        toast.success(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          sub_category: [],
          unit: "",
          stock: "",
          actual_price: "",
          selling_price: "",
          bar_code: "",
          description: "",
          publish: "",
        });
        window.location.reload();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
      setloading1(false);
    }
  };

  const genBarcode = () => {
    const randomBarcode = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    setData((prev) => ({
      ...prev, // Spread the previous state
      bar_code: randomBarcode, // Correctly update `bar_code`
    }));
  };

  return (
    <div className="p-5">
      <MetaTags title={"Add Product | Stock Management"} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Add Product</h2>
          <p className="text-sm">Create new product</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={"/products"}
            className="bg-primary-blue rounded py-2 px-2 text-white"
          >
            View Products
          </Link>
        </div>
      </div>
      <Divider />
      <div className="bg-white mt-3 rounded">
        <div className="border-b flex gap-3 items-center p-2">
          <MdStore size={18} />
          <h2 className="font-semibold text-md">Add Product</h2>
        </div>
        <div className="p-4">
          <form
            action=""
            className="grid grid-cols-2 gap-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                id="name"
                onChange={handleChange}
                value={data.name}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category">Category</label>
              <select
                name="category"
                id="category"
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;

                  const categoryDetails = allCategory.find(
                    (el) => el._id === value
                  );

                  setData((pre) => {
                    return {
                      ...pre,
                      category: [...pre.category, categoryDetails],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((category, index) => {
                  return (
                    <option
                      value={category?._id}
                      key={category._id + "category"}
                    >
                      {category?.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-wrap gap-2 relative">
                {data.category?.map((cat, index) => {
                  return (
                    <div
                      className="bg-white shadow-md flex items-center gap-2 px-1 m-1 absolute"
                      key={cat._id + "category"}
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
            </div>
            <div className="grid gap-2">
              <label htmlFor="sub_category">Sub Category</label>
              <select
                name="sub_category"
                id="sub_category"
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;

                  const categoryDetails = allSubCategory.find(
                    (el) => el._id === value
                  );

                  setData((pre) => {
                    return {
                      ...pre,
                      sub_category: [...pre.sub_category, categoryDetails],
                    };
                  });
                  setSelectSubCategory("");
                }}
              >
                <option value={""}>Select Sub Category</option>
                {allSubCategory.map((subcategory, index) => {
                  return (
                    <option
                      value={subcategory?._id}
                      key={subcategory._id + "subcategory"}
                    >
                      {subcategory?.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-wrap gap-2 relative">
                {data.sub_category?.map((cat, index) => {
                  return (
                    <div
                      className="bg-white shadow-md flex items-center gap-2 px-1 m-1 absolute"
                      key={cat._id + "sub_category"}
                    >
                      {cat.name}
                      <div
                        className="cursor-pointer"
                        onClick={() => handleRemoveSubCategorySelected(cat._id)}
                      >
                        <IoClose className="hover:text-red-500" size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                name="unit"
                placeholder="Enter unit"
                id="unit"
                onChange={handleChange}
                value={data.unit}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="actual_price">Actual Price</label>
              <input
                type="text"
                name="actual_price"
                placeholder="Enter actual price"
                id="actual_price"
                onChange={handleChange}
                value={data.actual_price}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>{" "}
            <div className="grid gap-2">
              <label htmlFor="selling_price">Selling Price</label>
              <input
                type="text"
                name="selling_price"
                placeholder="Enter selling price"
                id="selling_price"
                onChange={handleChange}
                value={data.selling_price}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bar_code" className="flex justify-between">
                <p>Barcode</p>
                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={genBarcode}
                    className="border-primary-blue border rounded py-1 px-1"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBarCode(true)}
                    className="border-primary-blue border rounded py-2 px-2"
                  >
                    <MdQrCode />
                  </button>
                </div>
              </label>
              <input
                type="text"
                name="bar_code"
                placeholder="Enter bar_code"
                id="bar_code"
                onChange={handleChange}
                value={data.bar_code}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              />
              {/* <div className="border p-4 bg-white shadow-lg">
                <Barcode value={data.bar_code} />
              </div> */}
            </div>
            <div className="grid gap-2">
              <label htmlFor="publish">Publish</label>
              <select
                name="publish"
                id="publish"
                onChange={handleChange}
                value={data.publish}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              >
                <option value={""}>Select publish type</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div className="grid gap-2 col-span-2">
              <label htmlFor="description">Description</label>
              <textarea
                rows={7}
                name="description"
                id="description"
                onChange={handleChange}
                value={data.description}
                className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
              ></textarea>
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
                <div className="flex flex-wrap gap-4">
                  {data.image.map((img, index) => {
                    return (
                      <div
                        key={img + index}
                        className="h-20 w-20 mt-2 min-w-20 border cursor-pointer relative group"
                      >
                        <img
                          src={PathToUrl(img)}
                          alt={img}
                          onClick={() => setOpenImageUrl(PathToUrl(img))}
                        />
                        <div
                          onClick={() => handleDeleteImage(index)}
                          className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-900 rounded text-white hidden group-hover:block"
                        >
                          <MdDelete />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <button className="bg-primary-blue rounded py-2 px-2 text-white w-full">
                {loading1 ? "Loading..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showBarCode && (
        <div className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center">
          <div className="border p-4 bg-white shadow-lg rounded max-w-xl w-full">
            <div className="flex justify-between">
              <h2 className="font-semibold text-xl">Barcode</h2>
              <button onClick={() => setShowBarCode(false)}>
                <MdClose size={25} />
              </button>
            </div>
            <div className="flex justify-center items-center">
              <Barcode value={data.bar_code} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
