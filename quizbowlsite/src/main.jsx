import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QuizBowl } from "./pages/QuizBowl";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Help } from "./pages/Help";
import { Login } from "./pages/Login";
import { MissingInfo } from "./pages/MissingInfo";
import App from "./Home";
import "./index.css";
import { ErrorPage } from "./Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <App>
        <ErrorPage />
      </App>
    ),
    children: [
      { index: true, element: <QuizBowl /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "contact", element: <Contact /> },
      { path: "help", element: <Help /> },
      { path: "missinginfo", element: <MissingInfo />}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
