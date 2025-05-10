import SummaryApi from "../../common/SummaryApi";
import Axios from "../utils/Axios";
const uploadImage = async (image, folder) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("folder", folder);
    const response = await Axios({
      ...SummaryApi.upload_image,
      data: formData,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export default uploadImage;
