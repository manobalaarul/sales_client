import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import PathToUrl from "../utils/PathToUrl";
import Axios from "../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import ConfirmBox from "../design/ConfirmBox";
import toast from "react-hot-toast";
const CategoryCard = ({
  data,
  setOpenEditCategory,
  setEditData,
  fetchCategory,
}) => {
  const [openConfirmDeleteBox, setOpenConfirmDeleteBox] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_category,
        data: deleteCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmDeleteBox(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="border rounded p-2 bg-white">
      <div className="flex items-center flex-col justify-center">
        <img src={PathToUrl(data.image)} alt="" className="w-32 h-32" />
        <p className="font-semibold text-lg">{data.name}</p>
      </div>
      <div className="flex justify-between gap-5 py-2">
        <button
          onClick={() => {
            setOpenEditCategory();
            setEditData();
          }}
          className="border px-1 py-1 w-full text-sm rounded border-green-600 bg-green-100 text-green-800 hover:bg-green-200"
        >
          Edit
        </button>
        <button
          onClick={() => {
            setOpenConfirmDeleteBox(true);
            setDeleteCategory(data);
          }}
          className="border px-1 w-full py-1 text-sm rounded border-red-600 bg-red-100 text-red-800 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
      {openConfirmDeleteBox && (
        <ConfirmBox
          cancel={() => setOpenConfirmDeleteBox(false)}
          close={() => setOpenConfirmDeleteBox(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </div>
  );
};

export default CategoryCard;
