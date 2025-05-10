export const baseUrl = import.meta.env.VITE_API_URL;

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  verify_email: {
    url: "/api/user/verify_email",
    method: "post",
  },
  fetchUserDetails: {
    url: "/api/user/fetch_user_details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  refresh_token: {
    url: "/api/user/refresh_token",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot_password",
    method: "post",
  },
  verify_password: {
    url: "/api/user/verify_password",
    method: "post",
  },
  reset_password: {
    url: "/api/user/reset_password",
    method: "post",
  },
  upload_avatar: {
    url: "/api/user/upload_avatar",
    method: "put",
  },
  update_user_details: {
    url: "/api/user/update_user_details",
    method: "put",
  },
  upload_image: {
    url: "/api/file/upload",
    method: "post",
  },
  add_category: {
    url: "/api/category/add_category",
    method: "post",
  },
  get_category: {
    url: "/api/category/get_category",
    method: "get",
  },
  update_category: {
    url: "/api/category/update_category",
    method: "put",
  },
  delete_category: {
    url: "/api/category/delete_category",
    method: "delete",
  },
  add_subcategory: {
    url: "/api/subcategory/add_subcategory",
    method: "post",
  },
  get_subcategory: {
    url: "/api/subcategory/get_subcategory",
    method: "get",
  },
  update_subcategory: {
    url: "/api/subcategory/update_subcategory",
    method: "put",
  },
  delete_subcategory: {
    url: "/api/subcategory/delete_subcategory",
    method: "delete",
  },
  add_product: {
    url: "/api/product/add_product",
    method: "post",
  },
  get_product: {
    url: "/api/product/get_product",
    method: "post",
  },
  get_product_by_category: {
    url: "/api/product/get_by_category",
    method: "post",
  },
  get_by_category_subcategory: {
    url: "/api/product/get_by_category_subcategory",
    method: "post",
  },
  get_product_details: {
    url: "/api/product/get_product_details",
    method: "post",
  },
  update_product: {
    url: "/api/product/update_product",
    method: "put",
  },
  delete_product: {
    url: "/api/product/delete_product",
    method: "delete",
  },
  search_product: {
    url: "/api/product/search_product",
    method: "post",
  },
  search_product_name: {
    url: "/api/product/search_product_name",
    method: "post",
  },
  add_stock: {
    url: "/api/stock/add_stock",
    method: "post",
  },
  get_stock: {
    url: "/api/stock/get_stock",
    method: "get",
  },
  save_order: {
    url: "/api/order/save_order",
    method: "post",
  },
  update_order: {
    url: "/api/order/update_order",
    method: "post",
  },
  get_order: {
    url: "/api/order/get_order",
    method: "get",
  },
  get_order_detail: {
    url: "/api/order/get_order_detail",
    method: "post",
  },
  confirm_order: {
    url: "/api/order/confirm_order",
    method: "post",
  },
  cancel_order: {
    url: "/api/order/cancel_order",
    method: "post",
  },
  return_order: {
    url: "/api/order/return_order",
    method: "post",
  },
  get_outstock: {
    url: "/api/outstock/get_outstock",
    method: "get",
  },
  get_profile: {
    url: "/api/profile/get_profile",
    method: "get",
  },
  update_profile: {
    url: "/api/profile/update_profile",
    method: "put",
  },
  todays_report: {
    url: "/api/dashboard/todays_report",
    method: "get",
  },
};

export default SummaryApi;
