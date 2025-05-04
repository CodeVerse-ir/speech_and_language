"use client";

import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContainerComponent = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={true}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Bounce}
    />
  );
};

export default ToastContainerComponent;
