import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { authRoutes } from "./routes/authRoutes";
import { privateRoutes } from "./routes/privateRoutes";


export const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...privateRoutes,
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);