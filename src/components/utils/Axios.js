import axios from "axios";
import SummaryApi, { baseUrl } from "../../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
// sending access token in the header
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//extend lifespan of access token with refresh token

Axios.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const newaccessToken = await refreshAccessToken(refreshToken);
        if (newaccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newaccessToken}`;
          return Axios(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refresh_token,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const accessToken = response.data.data.accesstoken;
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
  } catch (error) {}
};

export default Axios;
