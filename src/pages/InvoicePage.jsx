import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import PathToUrl from "../components/utils/PathToUrl";
import html2canvas from "html2canvas";

const InvoicePage = () => {
  const profileDetails = useSelector((state) => state.profile);
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoice");
  const [currentOrder, setCurrentOrder] = useState({});

  const fetchData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_order_detail,
        data: { _id: invoiceId },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setCurrentOrder(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [invoiceId]);

  const printInvoice = () => {
    const printContents = document.getElementById("printThis").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // to reload the app and restore full content
  };

  // ... (other imports remain same)

  // const downloadPDF = async () => {
  //   try {
  //     const element = document.getElementById("printThis");
  //     const canvas = await html2canvas(element, {
  //       scale: 1.5, // Higher quality
  //       logging: false,
  //       useCORS: true, // For images
  //     });

  //     const imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //     });

  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`Invoice-${currentOrder.invoiceNo || "Unknown"}.pdf`);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     AxiosToastError({ message: "Failed to generate PDF" });
  //   }
  // };

  return (
    <div className="p-5">
      <div className="bg-white shadow-md" id="printThis">
        <div className="flex justify-between items-center mb-4 bg-primary-blue px-4">
          <img
            src={PathToUrl(profileDetails.logo)}
            alt="Company Logo"
            className="h-16"
          />
          <h1 className="text-3xl font-bold text-white">INVOICE</h1>
        </div>
        <div className="p-5 rounded">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-gray-600 font-semibold text-2xl">
                #{currentOrder.invoiceNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">
                Date:{" "}
                {currentOrder.createdAt
                  ? new Date(currentOrder.createdAt).toLocaleDateString()
                  : ""}
              </p>
              <p
                className={`px-2 py-1 rounded inline-block mt-2 ${
                  currentOrder.status === "confirmed"
                    ? "bg-green-200 text-green-800"
                    : currentOrder.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {currentOrder.status}
              </p>
            </div>
          </div>

          {/* Company and Customer Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">From</h2>
              <p className="font-medium">{profileDetails.company_name}</p>
              <p className="text-gray-600">{profileDetails.address}</p>
              <p className="text-gray-600">Tamilnadu, India</p>
              <p className="text-gray-600">Phone: +{profileDetails.phone}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Bill To</h2>
              <p className="font-medium">{currentOrder.customer_name}</p>
              <p className="text-gray-600">{currentOrder.customer_address}</p>
              <p className="text-gray-600">Tamilnadu, India</p>
              <p className="text-gray-600">{currentOrder.customer_phone}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-16">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary-blue text-white">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(currentOrder.productList || []).map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      {item.productName}
                    </td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">₹ {item.price}</td>
                    <td className="py-3 px-4 text-right">
                      ₹ {item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="ml-auto w-64">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Subtotal:</span>
              <span>₹ {currentOrder.sub_total || 0}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Discount:</span>
                <span className="text-red-600">-₹ {currentOrder.discount}</span>
              </div>
            )}
            {currentOrder.gst > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">GST:</span>
                <span>₹ {currentOrder.gst}</span>
              </div>
            )}
            <div className="flex justify-between py-4 border-b-2 border-gray-300 font-bold text-lg">
              <span>Total:</span>
              <span>₹ {currentOrder.total || 0}</span>
            </div>
          </div>

          {/* Footer and Actions */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Thank you for your business!
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Terms & Conditions: Payment due within 15 days
            </p>

            <div className="flex justify-end space-x-4 print:hidden">
              {/* <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Download PDF
              </button> */}
              <button
                onClick={printInvoice}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
