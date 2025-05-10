import React, { useState } from "react";
import PathToUrl from "../utils/PathToUrl";
import Axios from "../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import ConfirmBox from "../design/ConfirmBox";
import toast from "react-hot-toast";

const SubCategoryCard = ({
  data,
  setOpenEditSubCategory,
  setEditData,
  fetchSubCategory,
}) => {
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });

  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_subcategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="border-2 p-2 bg-white">
      <div>
        <img
          src={PathToUrl(data.image)}
          alt=""
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="font-semibold text-lg">{data.name}</p>
      <div className="pt-4">
        <div className="w-full flex justify-between gap-2">
          <button
            onClick={() => {
              setOpenEditSubCategory();
              setEditData();
            }}
            className="border px-1 py-1 w-full text-sm rounded border-green-600 bg-green-100 text-green-800 hover:bg-green-200"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true);
              setDeleteSubCategory(data);
            }}
            className="border px-1 w-full py-1 text-sm rounded border-red-600 bg-red-100 text-red-800 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </div>
  );
};

export default SubCategoryCard;
