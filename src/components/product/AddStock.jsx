import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const AddStock = ({ data: productData, close, fetchProduct }) => {
  const [data, setData] = useState({
    productId: productData._id,
    seller_name: "",
    seller_phone: "",
    qty: "",
  });
  const [addLoading, setAddLoading] = useState(false);

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
      setAddLoading(true);
      const response = await Axios({
        ...SummaryApi.add_stock,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchProduct();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setAddLoading(false);
    }
  };

  return (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex justify-center items-center z-50">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Stock</h2>
        <IoClose
          className="cursor-pointer text-xl"
          onClick={close}
        />
      </div>

      <div className="mb-3">
        <label>Seller Name</label>
        <input
          type="text"
          name="seller_name"
          value={data.seller_name}
          onChange={handleOnChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-3">
        <label>Seller Phone</label>
        <input
          type="text"
          name="seller_phone"
          value={data.seller_phone}
          onChange={handleOnChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-3">
        <label>Quantity</label>
        <input
          type="number"
          name="qty"
          value={data.qty}
          onChange={handleOnChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        disabled={addLoading}
        className="bg-primary-blue text-white px-4 py-2 rounded float-end"
      >
        {addLoading ? "Adding..." : "Add Stock"}
      </button>
    </form>
  </div>
  );
};
export default AddStock;
