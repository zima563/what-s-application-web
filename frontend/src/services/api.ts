import axios from "axios";

// Base URLs mapped through gateway or fallback microservice ports
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "/api/v1/auth";
const CHAT_URL = import.meta.env.VITE_CHAT_URL || "/api/v1/chats";
const NOTIF_URL = import.meta.env.VITE_NOTIF_URL || "/api/v1/notifications";

export const authApi = axios.create({ baseURL: AUTH_URL });
export const chatApi = axios.create({ baseURL: CHAT_URL });
export const notifApi = axios.create({ baseURL: NOTIF_URL });

const attachAuthToken = (config: any) => {
  const token = localStorage.getItem("whatsapp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(attachAuthToken);
chatApi.interceptors.request.use(attachAuthToken);
notifApi.interceptors.request.use(attachAuthToken);
