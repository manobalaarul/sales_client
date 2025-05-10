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
import TextDate from "../components/utils/TextDate";

const InStockDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1; // Get page from URL
  const limit = 10;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Store total pages
  const [searchWord, setSearchWord] = useState("");

  const fetchData = async (searchValue) => {
    try {
      const response = await Axios({
        ...SummaryApi.get_stock,
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

    // Header row
    csvContent +=
      "ID,Product Name,Seller Name,Seller Phone,Unit,Quantity,Date\n";

    // Data rows
    data.forEach((row, index) => {
      csvContent +=
        [
          index + 1,
          row.productId?.name || "",
          row.seller_name || "",
          row.seller_phone || "",
          row.productId?.unit || "",
          row.quantity || "",
          TextDate(row.date),
        ].join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `InStock Details - ${TextDate(Date.now())}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  // Function to export to Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `InStock Details - ${TextDate(Date.now())}.xlsx`);
  };

  // Function to export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("InStock List", 20, 10);

    // Ensure autoTable is called correctly
    autoTable(doc, {
      head: [
        [
          "ID",
          "Product Name",
          "Seller Name",
          "Seller Phone",
          "Unit",
          "Quantity",
          "Date",
        ],
      ],
      body: data.map((row, index) => [
        index + 1,
        row.productId.name,
        row.seller_name,
        row.seller_phone,
        row.productId.unit,
        row.quantity,
        TextDate(row.date),
      ]),
    });

    doc.save(`InStock Details - ${TextDate(Date.now())}.pdf`);
  };

  // Function to print the table
  const printTable = () => {
    window.print();
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">InStock Details</h2>
          <p className="text-sm">All InStock Details</p>
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
            {/* <input
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
            /> */}
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
              <th className="p-3 border-r">Product Name</th>
              <th className="p-3 border-r">Seller Name</th>
              <th className="p-3 border-r">Seller Phone</th>
              <th className="p-3 border-r">Unit</th>
              <th className="p-3 border-r">Stock</th>
              <th className="p-3 border-r">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row._id} className="border-b hover:bg-gray-100">
                <td className="p-3 border-r">{index + 1}</td>
                <td className="p-3 border-r">{row.productId?.name}</td>
                <td className="p-3 border-r">{row.seller_name}</td>
                <td className="p-3 border-r">{row.seller_phone}</td>
                <td className="p-3 border-r">{row.productId?.unit}</td>
                <td className="p-3 border-r">{row.quantity}</td>
                <td className="p-3 border-r">{TextDate(row.date)}</td>
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

export default InStockDetails;
