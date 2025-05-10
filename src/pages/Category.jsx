import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import func from "../components/utils/fetchUserItems";
import CategoryCard from "../components/category/CategoryCard";
import AddCategory from "../components/category/AddCategory";
import { setAllCategory } from "../store/categorySlice";
import EditCategory from "../components/category/EditCategory";
import MetaTags from "../components/utils/MetaTags";
import { MdRefresh } from "react-icons/md";
import Divider from "../components/design/Divider";

const Category = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [editData, setEditData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const dispatch = useDispatch();

  const allCategories = useSelector((state) => state.category.allCategory);

  const fetchNewCate = async () => {
    const fetchCategory = await func.fetchAllCategory();
    dispatch(setAllCategory(fetchCategory.data));
  };

  useEffect(() => {
    setCategoryData(allCategories);
  }, [allCategories]);

  return (
    <div>
      <MetaTags title={"Categories | Stock Management"} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Categories</h2>
            <p className="text-sm">All Categories</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gray-200 rounded py-2 px-2 text-black">
              <MdRefresh size={22}/>
            </button>
            <button
              onClick={() => setOpenAddCategory(true)}
              className="bg-primary-blue rounded py-2 px-2 text-white"
            >
              Add Category
            </button>
          </div>
        </div>
        <Divider/>
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-3 pt-6">
          {categoryData.map((category, index) => {
            return (
              <CategoryCard
                data={category}
                key={"cate" + index}
                fetchCategory={fetchNewCate}
                setOpenEditCategory={() => setOpenEditCategory(true)}
                setEditData={() => setEditData(category)}
              />
            );
          })}
        </div>
      </div>
      {openAddCategory && (
        <AddCategory
          close={() => setOpenAddCategory(false)}
          fetchData={fetchNewCate}
        />
      )}
      {openEditCategory && (
        <EditCategory
          data={editData}
          close={() => setOpenEditCategory(false)}
          fetchData={fetchNewCate}
        />
      )}
    </div>
  );
};

export default Category;
