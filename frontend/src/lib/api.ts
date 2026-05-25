import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to include Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Don't redirect on 401 for /auth/me — that's expected when logged out
    return Promise.reject(err);
  },
);

export type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  image?: string;
  category?: string | { _id: string; name: string };
  material?: string;
  rating?: number;
  numReviews?: number;
  stock?: number;
  location?: string;
  dimensions?: { width?: number; height?: number; depth?: number };
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "contractor" | "admin";
  avatar?: string;
};

export type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
};

export type WishlistItem = {
  _id: string;
  product: Product;
};
