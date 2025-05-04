"use client";

import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { fullNameAndMobile } from "@/actions/auth/signup";

// components
import SubmitBtn from "../common/SubmitBtn";

interface UserInformation {
  first_name: string;
  last_name: string;
  parent_role: string;
  mobile_number: string;
  username: string;
  password: string;
  repeat_password: string;
}

interface FullNameFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  dataSignup: UserInformation;
  setDataSignup: Dispatch<SetStateAction<UserInformation>>;
}

const INITIAL_STATE_FULL_NAME_AND_MOBILE = {
  status: null,
  message: null,
  field: null,
  user_information: {
    first_name: "",
    last_name: "",
    parent_role: "F",
    mobile_number: "",
    username: "",
    password: "",
    repeat_password: "",
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

const NameAndMobileForm: React.FC<FullNameFormProps> = ({
  setStep,
  dataSignup,
  setDataSignup,
}) => {
  const [dataFullName, setDataFullName] = useState<{
    first_name: string;
    last_name: string;
    parent_role: string;
    mobile_number: string;
  }>({
    first_name: dataSignup.first_name || "",
    last_name: dataSignup.last_name || "",
    parent_role: dataSignup.parent_role || "F",
    mobile_number: dataSignup.mobile_number || "",
  });

  const [stateFullNameAndMobile, formActionFullNameAndMobile, isPending] =
    useActionState(fullNameAndMobile, INITIAL_STATE_FULL_NAME_AND_MOBILE);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    toast(stateFullNameAndMobile?.message, {
      type: `${getToastType(stateFullNameAndMobile.status)}`,
    });

    console.log("sign up stateFullNameAndMobile : ", stateFullNameAndMobile);

    if (stateFullNameAndMobile?.status === "success") {
      setDataSignup((prevUser) => ({
        ...prevUser,
        ...stateFullNameAndMobile.user_information,
      }));
      setStep(2);
    }
  }, [stateFullNameAndMobile, setStep, setDataSignup]);

  const handleFirst_name = (e: React.ChangeEvent<HTMLInputElement>) => {
    const first_nameValue = e.target.value;
    const pattern = /^[\u0600-\u06FF\s]*$/;
    if (pattern.test(first_nameValue) && first_nameValue.length <= 30) {
      setDataFullName((prev) => ({ ...prev, first_name: first_nameValue }));
    }
  };

  const handleLast_name = (e: React.ChangeEvent<HTMLInputElement>) => {
    const last_nameValue = e.target.value;
    const pattern = /^[\u0600-\u06FF\s]*$/;
    if (pattern.test(last_nameValue) && last_nameValue.length <= 30) {
      setDataFullName((prev) => ({ ...prev, last_name: last_nameValue }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFullName((prev) => ({ ...prev, parent_role: e.target.value }));
  };

  const handleMobile_number = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mobile_numberValue = e.target.value;
    const pattern = /^[0-9]*$/;
    if (pattern.test(mobile_numberValue) && mobile_numberValue.length <= 11) {
      setDataFullName((prev) => ({
        ...prev,
        mobile_number: mobile_numberValue,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-80 sm:w-96 py-5 px-7 bg-white dark:bg-zinc-700 shadow-normal rounded-xl">
      <div className="font-DanaMedium text-lg text-black dark:text-white text-center mb-6">
        ثبت نام
      </div>
      <form action={formActionFullNameAndMobile} className="w-full">
        {/* first_name */}
        <div className="relative flex flex-col items-start justify-center w-full h-10 mb-6">
          <label
            className="absolute -top-3.5 right-3 w-auto h-6 px-2 text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="first_name"
          >
            نام
          </label>
          <input
            className={`flex items-center justify-start w-full h-full px-3 pt-3 pb-2 text-black dark:text-white bg-transparent rounded border ${
              stateFullNameAndMobile.field?.includes("first_name")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type="text"
            id="first_name"
            name="first_name"
            autoComplete="off"
            value={dataFullName.first_name}
            onChange={handleFirst_name}
            ref={inputRef}
          />
        </div>

        {/* last_name */}
        <div className="relative flex flex-col items-start justify-center w-full h-10 mb-8">
          <label
            className="absolute -top-3.5 right-3 w-auto h-6 px-2 text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="last_name"
          >
            نام خانوادگی
          </label>
          <input
            className={`flex items-center justify-start w-full h-full px-3 pt-3 pb-2 text-black dark:text-white bg-transparent rounded border  ${
              stateFullNameAndMobile.field?.includes("last_name")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type="text"
            id="last_name"
            name="last_name"
            autoComplete="off"
            value={dataFullName.last_name}
            onChange={handleLast_name}
          />
        </div>

        {/* parent_role */}
        <div className="flex items-center justify-start w-full h-10 mb-8">
          <label
            className="w-auto h-6 px-2 text-nowrap text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="parent_role"
          >
            نقش والدین :
          </label>
          <div className="flex items-center justify-start gap-x-5">
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="parent_role"
                  value="F"
                  className="radio radio-sm checked:bg-orange-500"
                  checked={dataFullName.parent_role === "F"}
                  onChange={handleRoleChange}
                />
                <span className="label-text mr-2">پدر</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="parent_role"
                  value="M"
                  className="radio radio-sm checked:bg-orange-500"
                  checked={dataFullName.parent_role === "M"}
                  onChange={handleRoleChange}
                />
                <span className="label-text mr-2">مادر</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4 text-sm text-center text-zinc-700 dark:text-gray-300">
          با وارد کردن شماره موبایل کد تاییدی برای شما ارسال خواهد شد.
        </div>

        {/* mobile_number */}
        <div className="relative flex flex-col items-start justify-center w-full h-10 mb-4">
          <label
            className="absolute -top-3 right-3 w-auto h-6 px-2 text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="mobile_number"
          >
            شماره تلفن همراه
          </label>
          <input
            className={`flex items-center justify-start w-full h-full px-3 pt-1 text-black dark:text-white bg-transparent rounded border ${
              stateFullNameAndMobile.field?.includes("mobile_number")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type="text"
            id="mobile_number"
            name="mobile_number"
            autoComplete="off"
            dir="ltr"
            value={dataFullName.mobile_number}
            onChange={handleMobile_number}
          />
        </div>

        <SubmitBtn
          title="ادامه"
          style="w-full h-10 mb-4 text-center rounded-lg text-light text-white bg-orange-400 hover:bg-orange-500 transition-colors duration-150"
          isPending={isPending}
        />
      </form>
      <div className="flex items-center justify-center gap-x-1.5 text-center text-zinc-700 dark:text-gray-300">
        <div>اگر حساب کاربری دارید،</div>
        <Link
          href="/auth/login"
          className="text-orange-400 dark:text-orange-300"
        >
          وارد شوید.
        </Link>
      </div>
    </div>
  );
};

export default NameAndMobileForm;
