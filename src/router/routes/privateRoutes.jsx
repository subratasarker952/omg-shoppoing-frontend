import ProtectedRoute from "../gard/ProtectedRoute";

import PrivateLayout from "../../layouts/PrivateLayout";
import Dashboard from "../../pages/private/Dashboard";

import SpecificRoute from "../gard/SpecificRoute";

import AdminNotifications from "../../pages/private/admin/notification/AdminNotifications";
import Permissions from "../../pages/private/admin/permission/Permissions";
import Roles from "../../pages/private/admin/role/Roles";
import AllUsers from "../../pages/private/admin/user/AllUsers";

import AdminPayments from "../../pages/private/admin/payment/AdminPayments";
import AdminSettings from "../../pages/private/admin/setting/AdminSettings";
import AdminCategories from "../../pages/private/admin/category/AdminCategories";
import AdminProducts from "../../pages/private/admin/product/AdminProducts";
import AdminOrders from "../../pages/private/admin/order/AdminOrders";
import AdminShippingZones from "../../pages/private/admin/shipping/AdminShippingZones";
import AdminCoupons from "../../pages/private/admin/coupon/AdminCoupon";
import AdminBanners from "../../pages/private/admin/banner/AdminBanners";
import AdminFlashSale from "../../pages/private/admin/flashSale/AdminFlashSale";
import AdminSupports from "../../pages/private/admin/supports/AdminSupports";
import AdminReviews from "../../pages/private/admin/review/AdminReviews";

import MyNotifications from "../../pages/private/user/MyNotifications";
import MyProfile from "../../pages/private/user/MyProfile";
import Checkout from "../../pages/public/product/Checkout";
import MyOrders from "../../pages/private/user/MyOrders";
import MyOrderDetails from "../../pages/private/user/MyOrderDetails";
import MyPayments from "../../pages/private/user/MyPayments";
import MyWishlist from "../../pages/private/user/MyWishlist";
import MySupports from "../../pages/private/user/MySupports";
import MyReviews from "../../pages/private/user/MyReviews";
import AdminReports from "../../pages/private/admin/reports/AdminReports";
import AdminContact from "../../pages/private/admin/contact/AdminContact";


export const privateRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        element: <SpecificRoute roles={["admin"]} />,
        children: [
          {
            path: "admin-notifications",
            element: <AdminNotifications />,
          },
          {
            path: "admin-products",
            element: <AdminProducts />,
          },
          {
            path: "admin-categories",
            element: <AdminCategories />,
          },
          {
            path: "permissions",
            element: <Permissions />,
          },
          {
            path: "roles",
            element: <Roles />,
          },
          {
            path: "users",
            element: <AllUsers />,
          },
          {
            path: "banners",
            element: <AdminBanners />,
          },
          {
            path: "coupons",
            element: <AdminCoupons />,
          },
          {
            path: "flash-sales",
            element: <AdminFlashSale />,
          },
          {
            path: "reviews",
            element: <AdminReviews />,
          },
          {
            path: "payments",
            element: <AdminPayments />,
          },
          {
            path: "shipping-zones",
            element: <AdminShippingZones />,
          },
          {
            path: "supports",
            element: <AdminSupports />,
          },
          {
            path: "contacts",
            element: <AdminContact />,
          },
          {
            path: "settings",
            element: <AdminSettings />,
          },
        ],
      },

      {
        element: <SpecificRoute roles={["manager", "admin"]} />,
        children: [
          {
            path: "orders",
            element: <AdminOrders />,
          },
        ],
      },

      {
        element: <SpecificRoute roles={["user", "admin"]} />,
        children: [
          {
            path: "my-notifications",
            element: <MyNotifications />,
          },
          {
            path: "my-profile",
            element: <MyProfile />,
          },
          {
            path: "my-wishlist",
            element: <MyWishlist />,
          },
          {
            path: "my-checkout",
            element: <Checkout />,
          },
          {
            path: "my-orders",
            element: <MyOrders />,
          },
          {
            path: "my-orders/:id",
            element: <MyOrderDetails />,
          },
          {
            path: "my-payments",
            element: <MyPayments />,
          },
          {
            path: "my-reviews",
            element: <MyReviews />,
          },
          {
            path: "my-supports",
            element: <MySupports />,
          },
        ],
      },
    ],
  },
];