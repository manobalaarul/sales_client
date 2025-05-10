import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import separately
import * as XLSX from "xlsx";
import Divider from "../components/design/Divider";
import { MdRefresh } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import TextDate from "../components/utils/TextDate";

const OrderDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchWord, setSearchWord] = useState("");

  const generateInvoiceLink = (orderData) => {
    return `/invoice_print?invoice=${orderData._id}`;
  };

  const fetchData = async (searchValue) => {
    try {
      const response = await Axios({
        ...SummaryApi.get_order,
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

    // Header row matching your table
    csvContent +=
      "S.No,Customer Name,Products,Total Qty,Sub Total,GST,Total,Status,Date\n";

    // Data rows
    data.forEach((row, index) => {
      const products = row.productList
        .map((p) => `${p.productName} - ${p.quantity} Items`)
        .join("; ");
      csvContent +=
        [
          index + 1,
          `${row.customer_name} - ${row.customer_phone}`,
          products,
          row.total_qty,
          row.sub_total,
          row.gst,
          row.total,
          row.status,
          TextDate(row.createdAt),
        ].join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Order_Details_${TextDate(Date.now())}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // Function to export to Excel
  const exportExcel = () => {
    // Transform data to match table structure
    const excelData = data.map((row, index) => ({
      "S.No": index + 1,
      "Customer Name": `${row.customer_name} - ${row.customer_phone}`,
      Products: row.productList
        .map((p) => `${p.productName} - ${p.quantity} Items`)
        .join("; "),
      "Total Qty": row.total_qty,
      "Sub Total": row.sub_total,
      GST: row.gst,
      Total: row.total,
      Status: row.status,
      Date: TextDate(row.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Details");
    XLSX.writeFile(wb, `Order_Details_${TextDate(Date.now())}.xlsx`);
  };

  // Function to export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Order Details", 20, 10);

    // Prepare data for PDF
    const pdfData = data.map((row, index) => [
      index + 1,
      `${row.customer_name}\n${row.customer_phone}`,
      row.productList
        .map((p) => `${p.productName} - ${p.quantity} Items`)
        .join("\n"),
      row.total_qty,
      row.sub_total,
      row.gst,
      row.total,
      row.status,
      TextDate(row.createdAt),
    ]);

    autoTable(doc, {
      head: [
        [
          "S.No",
          "Customer",
          "Products",
          "Total Qty",
          "Sub Total",
          "GST",
          "Total",
          "Status",
          "Date",
        ],
      ],
      body: pdfData,
      styles: {
        fontSize: 8, // Smaller font size to fit more content
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // S.No
        1: { cellWidth: 25 }, // Customer
        2: { cellWidth: 40 }, // Products (widest column)
        3: { cellWidth: 15 }, // Total Qty
        4: { cellWidth: 20 }, // Sub Total
        5: { cellWidth: 15 }, // GST
        6: { cellWidth: 20 }, // Total
        7: { cellWidth: 20 }, // Status
        8: { cellWidth: 20 }, // Date
      },
      didDrawPage: function (data) {
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${data.pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save(`Order_Details_${TextDate(Date.now())}.pdf`);
  };

  // Function to print the table
  const printTable = () => {
    window.print();
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">OutStock Details</h2>
          <p className="text-sm">All OutStock Details</p>
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
              <th className="p-3 border-r">Print</th>
              <th className="p-3 border-r">Customer Name</th>
              <th className="p-3 border-r">Products</th>
              <th className="p-3 border-r">Total Qty</th>
              <th className="p-3 border-r">Sub Total</th>
              <th className="p-3 border-r">Gst</th>
              <th className="p-3 border-r">Total</th>
              <th className="p-3 border-r">Status</th>
              <th className="p-3 border-r">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row._id} className="border-b hover:bg-gray-100">
                <td className="p-3 border-r">{index + 1}</td>
                <td className="p-3 border-r">
                  <Link to={generateInvoiceLink(row)}>View Invoice</Link>
                </td>
                <td className="p-3 border-r">
                  {row.customer_name} - {row.customer_phone}
                </td>
                <td className="p-3 border-r">
                  {row.productList.map((product, index) => {
                    return (
                      <p className="bg-gray-300 rounded  my-2 p-2 text-xs">
                        {product.productName} - {product.quantity + " Items"}
                      </p>
                    );
                  })}
                </td>
                <td className="p-3 border-r">{row.total_qty}</td>
                <td className="p-3 border-r">{row.sub_total}</td>
                <td className="p-3 border-r">{row.gst}</td>
                <td className="p-3 border-r">{row.total}</td>
                <td className="p-3 border-r">
                  <p
                    className={`p-1 rounded ${
                      row.status == "confirmed" ? "bg-green-200" : "bg-gray-200"
                    }`}
                  >
                    {row.status}
                  </p>
                </td>
                <td className="p-3 border-r">{TextDate(row.createdAt)}</td>
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

export default OrderDetails;
