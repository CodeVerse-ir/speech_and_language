"use client";
import { useEffect } from "react";

interface ModalProps {
  modalId: string;
  btn_type: "button" | "submit";
  btn_style: string;
  btn_text: string;
  btn_svg?: React.ReactNode;
  title: string;
  text: string;
  isPending: boolean;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  modalId,
  btn_type,
  btn_style,
  btn_text,
  btn_svg,
  title,
  text,
  isPending,
  onConfirm,
}) => {
  useEffect(() => {
    const modal = document.getElementById(modalId);
    const modalToggle = document.querySelector(
      `[data-modal-toggle="${modalId}"]`
    );
    const modalHide = document.querySelectorAll(
      `[data-modal-hide="${modalId}"]`
    );

    const toggleModal = () => {
      modal?.classList.toggle("hidden");
      modal?.classList.toggle("flex");
      document.body.style.overflow = modal?.classList.contains("hidden")
        ? "auto"
        : "hidden";
    };

    const handleConfirm = () => {
      onConfirm?.();
      toggleModal();
    };

    const handleCancel = () => {
      toggleModal();
    };

    modalToggle?.addEventListener("click", toggleModal);
    modalHide.forEach((btn) => {
      if (btn.getAttribute("data-modal-hide-action") === "confirm") {
        btn.addEventListener("click", handleConfirm);
      } else {
        btn.addEventListener("click", handleCancel);
      }
    });

    return () => {
      modalToggle?.removeEventListener("click", toggleModal);
      modalHide.forEach((btn) => {
        if (btn.getAttribute("data-modal-hide-action") === "confirm") {
          btn.removeEventListener("click", handleConfirm);
        } else {
          btn.removeEventListener("click", handleCancel);
        }
      });
    };
  }, [modalId, onConfirm]);

  return (
    <>
      <button
        data-modal-toggle={modalId}
        className={btn_style}
        type="button"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-x-2">
            <div>منتظر بمانید</div>
            <div className="flex items-center justify-center w-9 h-2 gap-x-1 child:size-2 child:rounded-full child:bg-white">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-x-1">
            <div>{btn_text}</div>
            <div>{btn_svg}</div>
          </div>
        )}
      </button>

      <div
        id={modalId}
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-900 bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-sm md:text-base lg:text-xl font-DanaMedium md:font-DanaBold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:text-red-500 w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors duration-150"
                  data-modal-hide={modalId}
                  data-modal-hide-action="cancel"
                >
                  <svg
                    className="size-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-4 md:p-5 space-y-4 text-xs md:text-sm lg:text-base font-Dana">{text}</div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide={modalId}
                  data-modal-hide-action="cancel"
                  type="button"
                  className="py-2.5 px-5 me-3 text-xs md:text-sm lg:text-base font-DanaMedium focus:outline-none bg-transparent rounded-lg border border-red-500 hover:bg-red-500 text-red-500 hover:text-white focus:z-10 transition-colors duration-150"
                >
                  لغو
                </button>
                <button
                  data-modal-hide={modalId}
                  data-modal-hide-action="confirm"
                  type={btn_type}
                  className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-red-500 font-DanaMedium rounded-lg text-xs md:text-sm lg:text-base px-5 py-2.5 text-center transition-colors duration-150"
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
