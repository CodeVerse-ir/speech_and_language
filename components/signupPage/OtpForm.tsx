"use client";

import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { checkOtp } from "@/actions/auth/signup";
import { toast } from "react-toastify";

// components
import SubmitBtn from "../common/SubmitBtn";
import ResendOtp from "../loginPage/ResendOtp";

interface UserInformation {
  first_name: string;
  last_name: string;
  mobile_number: string;
}

interface OtpFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  dataSignup: UserInformation;
}

const INITIAL_STATE_OTP_FORM = {
  status: null,
  message: null,
  field: null,
  error_code: 0,
  user_information: {
    first_name: "",
    last_name: "",
    mobile_number: "",
  },
};

type ToastType = "success" | "error" | "info" | "warning";

function getToastType(status: string | null): ToastType {
  if (status === null) {
    return "info";
  }
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "info":
      return "info";
    case "warning":
      return "warning";
    default:
      return "info";
  }
}

const OtpForm: React.FC<OtpFormProps> = ({ setStep, dataSignup }) => {
  // 6 otp input
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(5).fill(null));

  const router = useRouter();

  const [counter, setCounter] = useState<number>(2);
  const counterRef = useRef(counter);

  const [stateOtp, formActionOtp, isPending] = useActionState(
    checkOtp,
    INITIAL_STATE_OTP_FORM
  );

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  useEffect(() => {
    toast(stateOtp?.message, { type: `${getToastType(stateOtp?.status)}` });

    console.log("CheckOtpForm stateOtp : ", stateOtp);

    if (stateOtp?.status === "success") {
      router.push("/");
    } else if (
      stateOtp?.status === "error" &&
      stateOtp?.message !== "کد احراز هویت الزامی است."
    ) {
      if (counterRef.current === 0) {
        setStep(1);
      } else {
        setCounter(counterRef.current - 1);
      }
    }
  }, [stateOtp, router, setStep]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // اگر ورودی عدد باشد
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // به ورودی بعدی بروید
      if (index < otp.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }

    // اگر ورودی خالی است
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const previousInput = inputRefs.current[index - 1];
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-80 sm:w-96 py-5 px-7 bg-white dark:bg-zinc-700 shadow-normal rounded-xl">
      <div className="font-DanaMedium text-lg text-black dark:text-white text-center mb-4">
        کد تایید
      </div>
      <form action={formActionOtp} className="w-full">
        <div className="flex items-center justify-center mb-4 text-sm text-center text-zinc-700 dark:text-gray-300">
          کد تایید پنج‌ رقمی به شماره {dataSignup.mobile_number} ارسال شد.
        </div>

        {/* otp_code */}
        <div
          className="flex items-center justify-center w-full gap-x-3 mb-4"
          dir="ltr"
        >
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              className={`text-center size-11 sm:size-14 rounded-lg text-black dark:text-whiteّ bg-transparent border-2 ${
                stateOtp.field?.includes("otp")
                  ? "border-red-500"
                  : "border-gray-400"
              } focus:border-orange-300 transition-colors duration-150 outline-none`}
              value={value}
              maxLength={1}
              name={`otp${index}`}
              autoComplete="off"
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleInputKeyDown(e, index)}
            />
          ))}
        </div>

        <SubmitBtn
          title="تایید"
          style="w-full h-10 mb-3 text-center rounded-lg text-light text-white bg-orange-400 hover:bg-orange-500 transition-colors duration-150"
          isPending={isPending}
        />
      </form>

      <ResendOtp />

      <button
        onClick={() => setStep(2)}
        className="flex items-center justify-center mt-3 text-center text-zinc-700 dark:text-gray-300"
      >
        برگشت
      </button>
    </div>
  );
};

export default OtpForm;
