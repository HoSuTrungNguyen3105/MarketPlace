import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import App from "../App.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <div>Homes</div>,
      },
      {
        path: "/setting",
        element: <div>Setting</div>,
      },
      {
        path: "/profile",
        element: <Home />,
      },
    ],
  },
]);

export default router;
