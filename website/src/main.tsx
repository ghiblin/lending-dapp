import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes";
import { MetaMaskContextProvider } from "./hooks/use-metamask";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MetaMaskContextProvider>
      <RouterProvider router={router} />
    </MetaMaskContextProvider>
  </React.StrictMode>
);
