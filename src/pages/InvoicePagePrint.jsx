import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { data, useSearchParams } from "react-router-dom";
import TextDate from "../components/utils/TextDate";

const InvoicePagePrint = ({ order }) => {
  const profileDetails = useSelector((state) => state.profile);
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoice");
  const fetchData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_order_detail,
        data: {
          _id: invoiceId,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setCurrentOrder(responseData.data);
        console.log(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [invoiceId]);

  const [currentOrder, setCurrentOrder] = useState({});
  // const currentOrder = order || {
  //   id: "INV-00123",
  //   date: new Date(),
  //   customer_name: "Walk-in Customer",
  //   customer_phone: "",
  //   items: [
  //     { name: "Product A", qty: 2, price: 100, total: 200 },
  //     { name: "Product B", qty: 1, price: 150, total: 150 },
  //     { name: "Product C", qty: 3, price: 75, total: 225 },
  //   ],
  //   subtotal: 575,
  //   tax: 57.5,
  //   discount: 0,
  //   total: 632.5,
  //   payment_method: "Cash",
  //   cashier: "Staff 01",
  // };

  // if (!currentOrder.subtotal) {
  //   currentOrder.subtotal = currentOrder.items.reduce(
  //     (sum, item) => sum + item.total,
  //     0
  //   );
  // }
  // if (!currentOrder.total) {
  //   currentOrder.total =
  //     currentOrder.subtotal +
  //     (currentOrder.tax || 0) -
  //     (currentOrder.discount || 0);
  // }

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="print-container">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 0;
            margin: 0;
            font-size: 12px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Invoice content */}
      <div className="w-80mm mx-auto p-2 font-mono">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold">{profileDetails.company_name}</h1>
          <p className="text-xs">{profileDetails.address}</p>
          <p className="text-xs">Phone: {profileDetails.phone}</p>
          <p className="text-xs">GST No: {profileDetails.gstNo}</p>
        </div>

        {/* Invoice info */}
        <div className="border-b border-black mb-2 pb-2">
          <p className="flex justify-between">
            <span>INVOICE #:</span>
            <span>{currentOrder.invoiceNo}</span>
          </p>
          <p className="flex justify-between">
            <span>DATE:</span>
            <span>{TextDate(currentOrder.createdAt)}</span>
          </p>
        </div>

        {/* Customer info */}
        <div className="border-b border-black mb-2 pb-2">
          <p className="flex justify-between">
            <span>CUSTOMER:</span>
            <span>{currentOrder.customer_name}</span>
          </p>
          {currentOrder.customer_phone && (
            <p className="flex justify-between">
              <span>PHONE:</span>
              <span>{currentOrder.customer_phone}</span>
            </p>
          )}
        </div>

        {/* Items table */}
        <table className="w-full mb-2">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1">Item</th>
              <th className="text-right py-1">Qty</th>
              <th className="text-right py-1">Price</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.productList?.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-1">{item.productId.name}</td>
                <td className="text-right py-1">{item.quantity}</td>
                <td className="text-right py-1">₹ {item.price}</td>
                <td className="text-right py-1">₹ {item.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-b border-black mb-2 pb-2">
          <p className="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>₹ {currentOrder.sub_total}</span>
          </p>
          {currentOrder.gst > 0 && (
            <p className="flex justify-between">
              <span>TAX:</span>
              <span>₹ {currentOrder.gst}</span>
            </p>
          )}
          <p className="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>₹ {currentOrder.total}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs">
          <p>Thank you for your business!</p>
          <p>Returns accepted within 7 days with receipt</p>
        </div>

        {/* Action buttons (hidden when printing) */}
        <div className="no-print mt-4 flex justify-center space-x-4">
          <button
            onClick={printInvoice}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePagePrint;
