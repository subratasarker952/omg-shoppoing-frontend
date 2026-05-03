import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast'
import { router } from "./router/Router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { ConfigProvider } from "./context/ConfigContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ConfigProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          <Toaster />
        </WishlistProvider>
      </CartProvider>
    </ConfigProvider>
  </AuthProvider>
);