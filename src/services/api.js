/*import urls from "./urls";
import axios from "axios";
import { useLocalStorage } from "../hooks";

const ignore = [urls.signUp, urls.login, ];

const api = axios.create({
  baseURL: urls.baseURL.dev,
});

api.interceptors.request.use(
  function (config) {
    if (!ignore.includes(config.url)) {
      const { getItem } = useLocalStorage();
      const accessToken = getItem("access_token");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    if (response.config.url === urls.verifyOtp && response.status === 200) {
      const data = response.data.data;
      const { setItem } = useLocalStorage();

      if (data.token !== undefined) {
        setItem("access_token", data.token);
      }
      
      if (data.user_data !== undefined) {
        setItem("user_data", JSON.stringify(data.user_data));
      }
    }
    return response;
  },
  function (error) {
    if (error.response) {
      console.error("Backend returned status code:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  }
);
export default api;
*/