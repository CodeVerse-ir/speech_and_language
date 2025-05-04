"use clinet";

import { resendOtp } from "@/actions/auth/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResendOtp = () => {
  const [seconds, setSeconds] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seconds > 0 && isTimerActive) {
      const timerId = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (seconds === 0) {
      setIsTimerActive(false);
    }
  }, [seconds, isTimerActive]);

  const handleResendCode = async () => {
    setLoading(true);
    const res = await resendOtp();
    if (res.status === "success") {
      toast("کد جدید ارسال شد.", {
        type: "success",
      });
      setSeconds(120);
      setIsTimerActive(true);
    } else {
      toast("ارسال کد امکان پذیر نبود ، مجددا اقدام کنید.", {
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-nowrap items-center justify-center gap-x-0.5 text-sm text-zinc-700 dark:text-gray-300">
      <div className="flex items-center justify-center gap-x-0.5"></div>

      {!isTimerActive ? (
        <>
          {loading ? (
            <div className="flex items-center justify-center gap-x-2">
              <div className="text-sm text-orange-500">منتظر بمانید</div>
              <div className="flex items-center justify-center w-7 h-1 gap-x-1 child:size-1.5 child:rounded-full child:bg-orange-500">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleResendCode}
              className="text-sm text-green-500 hover:text-green-600 transition-colors duration-150"
            >
              ارسال مجدد کد
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center gap-x-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 mb-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <div>{`0${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(
            2,
            "0"
          )}`}</div>
          <div>تا دریافت مجدد کد</div>
        </div>
      )}
    </div>
  );
};

export default ResendOtp;
