import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "../components/utils/MetaTags";
import AddSubCategory from "../components/subcategory/AddSubCategory";
import EditSubCategory from "../components/subcategory/EditSubCategory";
import { setAllSubCategory } from "../store/categorySlice";
import SubCategoryCard from "../components/subcategory/SubCategoryCard";
import func from "../components/utils/fetchUserItems";
import { MdRefresh } from "react-icons/md";
import Divider from "../components/design/Divider";

const SubCategory = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [editData, setEditData] = useState({});
  const [subCategoryData, setSubCategoryData] = useState([]);
  const dispatch = useDispatch();

  const allSubCategories = useSelector(
    (state) => state.category.allSubCategory
  );

  const fetchNewSubCate = async () => {
    const fetchSubCategory = await func.fetchAllSubCategory();
    dispatch(setAllSubCategory(fetchSubCategory.data));
  };

  useEffect(() => {
    setSubCategoryData(allSubCategories);
  }, [allSubCategories]);

  return (
    <div>
      <MetaTags title={"Sub Categories | Stock Management"} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Sub Categories</h2>
            <p className="text-sm">All Sub Categories</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gray-200 rounded py-2 px-2 text-black">
              <MdRefresh size={22} />
            </button>
            <button
              onClick={() => setOpenAddSubCategory(true)}
              className="bg-primary-blue rounded py-2 px-2 text-white"
            >
              Add Category
            </button>
          </div>
        </div>
        <Divider />
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-3 pt-6">
          {subCategoryData.map((category, index) => {
            return (
              <SubCategoryCard
                data={category}
                key={"subcate" + index}
                fetchSubCategory={fetchNewSubCate}
                setOpenEditSubCategory={() => setOpenEditSubCategory(true)}
                setEditData={() => setEditData(category)}
              />
            );
          })}
        </div>
      </div>
      {openAddSubCategory && (
        <AddSubCategory
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchNewSubCate}
        />
      )}
      {openEditSubCategory && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEditSubCategory(false)}
          fetchData={fetchNewSubCate}
        />
      )}
    </div>
  );
};

export default SubCategory;
