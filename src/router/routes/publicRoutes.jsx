import PublicLayout from "../../layouts/PublicLayout";

import Landing from "../../pages/public/common/Landing";
import About from "../../pages/public/common/About";
import Contact from "../../pages/public/common/Contact";
import Pricing from "../../pages/public/common/Pricing";
import Terms from "../../pages/public/common/Terms";
import Privacy from "../../pages/public/common/Privacy";

import PaymentSuccess from "../../pages/public/payment/PaymentSuccess";
import PaymentFailed from "../../pages/public/payment/PaymentFailed";
import PaymentCancelled from "../../pages/public/payment/PaymentCancelled";
import PublicProducts from "../../pages/public/product/PublicProducts";
import ProductDetails from "../../pages/public/product/ProductDetails";

export const publicRoutes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "products",
        element: <PublicProducts />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-failed",
        element: <PaymentFailed />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
    ],
  },
];