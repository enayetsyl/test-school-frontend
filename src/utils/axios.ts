// src/utils/axios.ts
import axios, {
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "./authToken";

const BASE_URL =
  import.meta.env.VITE_API_URL?.toString() ?? "http://localhost:8080/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers) config.headers = new AxiosHeaders();
  else if (!(config.headers instanceof AxiosHeaders))
    config.headers = AxiosHeaders.from(config.headers);
  const token = getAccessToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});
