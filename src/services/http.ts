import { ENV } from "@/config/env";
import { clearAccessToken, getAccessToken } from "@/storage/authStorage";
import axios from "axios";

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = {
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await clearAccessToken();
    }
    return Promise.reject(error);
  },
);
