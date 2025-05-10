import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import separately
import * as XLSX from "xlsx";
import Divider from "../components/design/Divider";
import { MdAdd, MdDelete, MdEdit, MdRefresh } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import PathToUrl from "../components/utils/PathToUrl";
import Barcode from "react-barcode";
import { AiOutlineEye } from "react-icons/ai"; // Eye icon
import toast from "react-hot-toast";
import AddStock from "../components/product/AddStock";

const StockDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1; // Get page from URL
  const limit = 10;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Store total pages
  const [searchWord, setSearchWord] = useState("");
  const [showBarcode, setShowBarcode] = useState(null);
  const [openAddStockId, setOpenAddStockId] = useState(null);

  const fetchData = async (searchValue) => {
    try {
      const response = await Axios({
        ...SummaryApi.search_product,
        data: { page, limit, search: searchValue },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
        setTotalPages(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const addStock = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_product,
        data: { _id: id },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchData("");
  }, [page]); // Refetch data when page changes

  // Function to change the page in the URL
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  // Function to export to CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Email\n";
    data.forEach((row) => {
      csvContent += `${row.id},${row.name},${row.email}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Function to export to Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };

  // Function to export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 20, 10);

    // Ensure autoTable is called correctly
    autoTable(doc, {
      head: [["ID", "Name", "Price"]],
      body: data.map((row, index) => [index + 1, row.name, row.price]),
    });

    doc.save("products.pdf");
  };

  // Function to print the table
  const printTable = () => {
    window.print();
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Stock Details</h2>
          <p className="text-sm">All Stock Details</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchData()}
            className="bg-gray-200 rounded py-2 px-2 text-black"
          >
            <MdRefresh size={22} />
          </button>
          <Link
            to={"/add_products"}
            className="bg-primary-blue rounded py-2 px-2 text-white"
          >
            Add Product
          </Link>
        </div>
      </div>
      <Divider />
      <div className="p-2 bg-white rounded">
        <div className="lg:flex grid gap-4 lg:justify-between py-3">
          <div>
            <input
              type="text"
              name="search"
              onChange={(e) => {
                const value = e.target.value;
                setSearchWord(value);
                fetchData(value); // Call fetchData with the updated search value
              }}
              value={searchWord}
              placeholder="Search Products"
              className="bg-transparent p-1 border border-primary-blue rounded focus:outline-none w-full"
            />
          </div>
          <div className="flex justify-between lg:justify-end">
            <button
              onClick={exportCSV}
              className="px-1 py-1 border border-primary-blue rounded mx-2"
            >
              CSV
            </button>
            <button
              onClick={exportExcel}
              className="px-1 py-1 border border-primary-blue rounded mx-2"
            >
              Excel
            </button>
            <button
              onClick={exportPDF}
              className="px-1 py-1 border border-primary-blue rounded mx-2"
            >
              PDF
            </button>
            <button
              onClick={printTable}
              className="px-1 py-1 border border-primary-blue rounded mx-2"
            >
              Print
            </button>
          </div>
        </div>
        {/* Table */}
        <table className="w-full border border-gray-300 mt-2 text-left bg-white">
          <thead>
            <tr className=" border-b">
              <th className="p-3 border-r">S.No</th>
              <th className="p-3 border-r">Action</th>
              <th className="p-3 border-r">Name</th>
              <th className="p-3 border-r w-18">Category</th>
              <th className="p-3 border-r text-xs">Sub Category</th>
              <th className="p-3 border-r">Unit</th>
              <th className="p-3 border-r">Stock</th>
              <th className="p-3 border-r text-xs">Bar Code</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row._id} className="border-b hover:bg-gray-100">
                <td className="p-3 border-r">{index + 1}</td>
                <td className="p-3 border-r">
                  <button
                    onClick={() => setOpenAddStockId(row._id)}
                    className="border border-primary-blue px-2 py-2 rounded"
                  >
                    <MdAdd />
                  </button>

                  {openAddStockId === row._id && (
                    <AddStock
                      key={row._id + "add_stock"}
                      data={row}
                      close={() => setOpenAddStockId(null)}
                      fetchProduct={fetchData}
                    />
                  )}
                </td>
                <td className="p-3 border-r">{row.name}</td>
                <td className="p-3 border-r">
                  {row.category.map((c, index) => (
                    <span key={index}>
                      {c.name}
                      {index !== row.category.length - 1 ? "| " : ""}
                    </span>
                  ))}
                </td>
                <td className="p-3 border-r">
                  {row.sub_category.map((c, index) => (
                    <span key={index}>
                      {c.name}
                      {index !== row.sub_category.length - 1 ? "| " : ""}
                    </span>
                  ))}
                </td>
                <td className="p-3 border-r">{row.unit}</td>
                <td className="p-3 border-r">{row.stock}</td>
                <td className="p-3 border-r relative">
                  <AiOutlineEye
                    size={24}
                    className="cursor-pointer"
                    onMouseEnter={() => setShowBarcode(row._id)} // Show barcode on hover
                    onMouseLeave={() => setShowBarcode(null)} // Hide barcode when not hovering
                  />

                  {showBarcode === row._id && (
                    <div className="absolute top-0 right-20 bg-white p-2 shadow-lg border rounded">
                      <Barcode value={row.bar_code} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => changePage(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                page === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
