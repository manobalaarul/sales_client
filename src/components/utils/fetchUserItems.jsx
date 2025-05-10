import SummaryApi from "../../common/SummaryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.fetchUserDetails,
    });

    return response.data;
  } catch (error) {}
};

const fetchAllCategory = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.get_category,
    });

    return response.data;
  } catch (error) {}
};

const fetchAllSubCategory = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.get_subcategory,
    });

    return response.data;
  } catch (error) {}
};

const fetchProfileDetails = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.get_profile,
    });

    return response.data;
  } catch (error) {}
};

export default {
  fetchUserDetails,
  fetchAllCategory,
  fetchAllSubCategory,
  fetchProfileDetails,
};
