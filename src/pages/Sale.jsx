import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdStore } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "../components/utils/AxiosToastError";
import Axios from "../components/utils/Axios";
import SummaryApi from "../common/SummaryApi";
import Divider from "../components/design/Divider";
import MetaTags from "../components/utils/MetaTags";
import { useSelector } from "react-redux";

const Sales = () => {
  const [productData, setProductData] = useState({
    productId: "",
    productName: "",
    quantity: "",
    price: "",
    totalPrice: "",
  });
  const [productList, setProductList] = useState([]);
  const profileDetails = useSelector((state) => state.profile);
  const [data, setData] = useState({
    invoiceNo: "",
    productList: productList,
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    total_qty: "",
    sub_total: "",
    gst: "",
    total: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // -1 means none selected
  const [loading, setloading] = useState(false);
  const [confirmText, setConfirmText] = useState("Confirm");
  const quantityRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const generateInvoiceNumber = () => {
    const prefix = "INV";
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit random number
    return `${prefix}${randomNumber}`;
  };
  const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNumber());
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleAddProduct = () => {
    if (!productData.productName || !productData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const exists = productList.find(
      (item) => item.productId === productData.productId
    );
    if (exists) {
      toast.error("Product already added!");
      return;
    }

    const totalPrice =
      parseInt(productData.quantity) * parseInt(productData.price || 0);

    const newProduct = {
      ...productData,
      totalPrice,
    };

    setProductList((prev) => [...prev, newProduct]);

    // Reset form inputs
    setProductData({
      productId: "",
      productName: "",
      quantity: "",
      price: "",
      totalPrice: "",
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (productData.productName.trim()) {
        searchProductSuggestions(productData.productName);
      }
    }, 300); // delay to prevent too many API calls

    return () => clearTimeout(delayDebounceFn);
  }, [productData.productName]);

  const handleQuantityChange = (index, value) => {
    const newList = [...productList];

    const quantity = parseInt(value) || 0;
    const selling_price = parseFloat(newList[index].selling_price) || 0;

    newList[index].quantity = quantity;
    newList[index].totalPrice = (quantity * selling_price).toFixed(2);

    setProductList(newList);
  };

  useEffect(() => {
    const subTotal = productList.reduce(
      (sum, item) => sum + parseFloat(item.totalPrice),
      0
    );
    const totalQty = productList.reduce(
      (sum, item) => sum + parseInt(item.quantity || 0),
      0
    );
    const gstPer = parseFloat(profileDetails.gstPer) || 0; // convert to float, fallback to 0
    const gst = subTotal * (gstPer / 100);
    const total = subTotal + gst;

    setData((prev) => ({
      ...prev,
      sub_total: subTotal.toFixed(2),
      total_qty: totalQty,
      gst: gst.toFixed(2),
      total: total.toFixed(2),
    }));
  }, [productList]);

  const handleRemoveProduct = (index) => {
    const newList = [...productList];
    newList.splice(index, 1);
    setProductList(newList);
  };

  const searchProductSuggestions = async (name) => {
    try {
      const response = await Axios({
        ...SummaryApi.search_product_name, // assuming you have this
        data: { search: name }, // or whatever your API expects
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setSearchResults(responseData.data); // adjust based on your API response
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };

  const barcodeProductSuggestions = async (bar_code) => {
    try {
      const response = await Axios({
        ...SummaryApi.search_product_name, // assuming you have this
        data: { bar_code: bar_code }, // or whatever your API expects
      });

      const { data: responseData } = response;
      if (responseData.success) {
        //    setSearchResults(responseData.data); // adjust based on your API response
        //    setShowDropdown(true);
        selectItem(responseData.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectItem = (item) => {
    if (item.stock > 0) {
      const selling_price = item.selling_price;
      setProductData((prev) => ({
        ...prev,
        productName: item.name,
        productId: item._id,
        price: selling_price,
      }));

      setShowDropdown(false);
      setSelectedIndex(-1); // reset
      setTimeout(() => {
        quantityRef.current?.focus();
      }, 0); // Wait for DOM to update before focusing
    } else {
      toast.error("Out of Stock, Please update stock");
      setShowDropdown(false); // optional: close the dropdown
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (productList.length === 0) {
      toast.error("Add at least one product!");
      return null;
    }

    try {
      const response = await Axios({
        ...SummaryApi.save_order,
        data: { ...data, productList, invoiceNo },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);

        const createdOrderId = responseData?.data?._id;
        // ⬆️ adapt this based on your API response format

        setProductList([]);
        setData({
          invoiceNo: "",
          customer_name: "",
          customer_phone: "",
          customer_address: "",
          productList: [],
          total_qty: "",
          sub_total: "",
          gst: "",
          total: "",
        });

        return createdOrderId; // ✅ Return the order ID here
      } else {
        toast.error(responseData.message);
        return null;
      }
    } catch (error) {
      AxiosToastError(error);
      return null;
    }
  };

  const handleConfirmClick = async () => {
    const orderId = await handleSubmit();

    if (!orderId) {
      toast.error("Order submission failed. Cannot confirm.");
      return;
    }

    for (let i = 1; i <= 3; i++) {
      setConfirmText(`Please wait... ${i}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setConfirmText("Confirm");

    confirmOrder(orderId);
  };

  const confirmOrder = async (orderId) => {
    try {
      const response = await Axios({
        ...SummaryApi.confirm_order,
        data: { orderId },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        navigate(`/invoice_print?invoice=${orderId}`); // ✅ Navigate after success
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  

  return (
    <div className="p-5">
      <MetaTags title={"Add Product | Stock Management"} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Sales</h2>
          <p className="text-sm">Create new sales</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={"/order_details"}
            className="bg-primary-blue rounded py-2 px-2 text-white"
          >
            View Sales
          </Link>
        </div>
      </div>
      <Divider />
      <div className="bg-white mt-3 rounded">
        <div className="border-b flex justify-between gap-3 items-center p-2">
          <div className="flex gap-3">
            <MdStore size={18} />
            <h2 className="font-semibold lg:text-md text-xs">
              Add Product List
            </h2>
          </div>
          <div>
            <h2 className="font-semibold lg:text-md text-xs">
              Invoice No : {invoiceNo}
            </h2>
          </div>
        </div>
        <div className="p-4">
          <form action="" className="">
            <div className="lg:grid flex flex-col  grid-cols-4 gap-4">
              <div className="grid gap-2">
                <label htmlFor="name">Bar Code</label>
                <input
                  type="text"
                  name="bar_code"
                  placeholder="Enter product bar code"
                  id="bar_code"
                  onChange={(e) => {
                    barcodeProductSuggestions(e.target.value);
                  }}
                  className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                />
              </div>
              <div ref={dropdownRef} className="grid gap-2 relative">
                <label htmlFor="product_name">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  value={productData.productName}
                  onChange={(e) => {
                    setProductData({
                      ...productData,
                      productName: e.target.value,
                    });
                    setShowDropdown(true);
                    setSelectedIndex(-1); // reset highlight
                    // Call your API here with debounce
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSelectedIndex((prev) =>
                        prev < searchResults.length - 1 ? prev + 1 : prev
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    } else if (e.key === "Enter") {
                      if (selectedIndex >= 0) {
                        const selectedItem = searchResults[selectedIndex];
                        selectItem(selectedItem);
                      }
                    }
                  }}
                />
                {showDropdown && searchResults.length > 0 && (
                  <ul className="dropdown-style">
                    {searchResults.map((item, index) => (
                      <li
                        key={item._id}
                        className={`p-2 cursor-pointer ${
                          index === selectedIndex
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onMouseDown={() => selectItem(item)} // Use onMouseDown to avoid blur before click
                      >
                        {item.name} - ₹{item.selling_price}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  ref={quantityRef}
                  placeholder="Enter quantity"
                  value={productData.quantity}
                  onChange={handleChange}
                  className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                />
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="bg-primary-blue rounded py-2 px-2 text-white w-full lg:mt-8 mt-4"
              >
                Add
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-md mb-2">Product List</h3>
              <table className="w-full block overflow-scroll border border-gray-300 mt-2 text-left bg-white">
                <thead>
                  <tr className=" border-b">
                    <th className="p-3 border-r">S.No</th>
                    <th className="p-3 border-r">Product Name</th>
                    <th className="p-3 border-r">Quantity</th>
                    <th className="p-3 border-r">Price</th>
                    <th className="p-3 border-r">Total Price</th>
                    <th className="p-3 border-r">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item, index) => (
                    <tr
                      key={index + "row"}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="p-3 border-r">{index + 1}</td>
                      <td className="p-3 border-r">{item.productName}</td>
                      <td className="p-3 border-r">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="w-20 border px-2 py-1 rounded focus:outline-none"
                        />
                      </td>

                      <td className="p-3 border-r">{item.price}</td>
                      <td className="p-3 border-r">{item.totalPrice}</td>
                      <td className="p-3 border-r">
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="p-2 border border-red-400 rounded hover:bg-red-100 transition"
                        >
                          <MdDelete className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="lg:grid flex flex-col grid-cols-6 gap-4 mt-4">
                <div className="grid gap-2 col-span-2">
                  <label htmlFor="customer_name">Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="Enter product customer name"
                    id="customer_name"
                    value={data.customer_name}
                    onChange={handleDataChange}
                    className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <label htmlFor="customer_phone">Customer Phone</label>
                  <input
                    type="text"
                    name="customer_phone"
                    placeholder="Enter product customer phone"
                    id="customer_phone"
                    value={data.customer_phone}
                    onChange={handleDataChange}
                    className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <label htmlFor="customer_address">Customer Address</label>
                  <input
                    type="text"
                    name="customer_address"
                    placeholder="Enter product customer address"
                    id="customer_address"
                    value={data.customer_address}
                    onChange={handleDataChange}
                    className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <label htmlFor="total_qty">Total Qty</label>
                  <input
                    type="text"
                    name="total_qty"
                    readOnly
                    id="total_qty"
                    value={data.total_qty}
                    onChange={handleDataChange}
                    className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <label htmlFor="gst">Gst</label>
                  <input
                    type="text"
                    name="gst"
                    readOnly
                    id="gst"
                    value={data.gst}
                    onChange={handleDataChange}
                    className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <label htmlFor="total">Total Amount</label>
                  <input
                    type="text"
                    name="total"
                    id="total"
                    value={data.total}
                    onChange={handleDataChange}
                    readOnly
                    className="bg-transparent p-2 border border-primary-blue rounded focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 mt-4 flex gap-3 justify-between">
              <button
                type="button"
                onClick={handleSubmit}
                className="border border-primary-blue rounded py-2 px-2 text-primary-blue w-full"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleConfirmClick}
                className="bg-primary-blue rounded py-2 px-2 text-white w-full"
              >
                {confirmText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sales;
