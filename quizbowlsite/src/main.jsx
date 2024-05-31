import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QuizBowl } from "./pages/QuizBowl";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Help } from "./pages/Help";
import { Login } from "./pages/Login";
import { ManageAccounts } from "./pages/ManageAccounts";
import { MissingInfo } from "./pages/MissingInfo";
import App from "./Home";
import "./index.css";
import "../src/components/global.css";
import "../src/components/buttons.css";
import "../src/components/navbar.css";
import "../src/components/sidebar.css";
import "../src/components/dialog.css";
import "../src/components/form-elements.css";
import "../src/components/layout.css";
import "../src/components/misc.css";
import { ErrorPage } from "./Home";
import { DuplicateDetect } from "./pages/DuplicateDetect";
import { Edit } from "./pages/Edit";

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
      { path: "missinginfo", element: <MissingInfo /> },
      { path: "duplicates", element: <DuplicateDetect /> },
      { path: "manageaccounts", element: <ManageAccounts /> },
      { path: "edit", element: <Edit /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
