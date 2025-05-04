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

// components
import SubmitBtn from "../common/SubmitBtn";
import { login } from "@/actions/auth/auth";

interface UsernameAndPasswordProps {
  setStep: Dispatch<SetStateAction<number>>;
}

const INITIAL_STATE_USERNAME_AND_PASSWORD = {
  status: null,
  message: null,
  field: null,
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

const UsernameAndPassword: React.FC<UsernameAndPasswordProps> = ({
  setStep,
}) => {
  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [stateLogin, formActionLogin, isPending] = useActionState(
    login,
    INITIAL_STATE_USERNAME_AND_PASSWORD
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    toast(stateLogin?.message, { type: `${getToastType(stateLogin?.status)}` });

    console.log("LoginForm stateLogin : ", stateLogin);

    // check first_time
    if (stateLogin?.status === "success") {
      setStep(2);
    }
  }, [stateLogin, setStep]);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDataLogin = { ...dataLogin };
    const usernameValue = e.target.value;
    const pattern = /^[0-9a-z_]*$/;
    if (pattern.test(usernameValue)) {
      newDataLogin.username = usernameValue;
      setDataLogin(newDataLogin);
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDataLogin = { ...dataLogin };
    const passwordValue = e.target.value;
    const pattern = /^[0-9a-zA-Z\-_*@#\$%]*$/;
    if (pattern.test(passwordValue)) {
      newDataLogin.password = passwordValue;
      setDataLogin(newDataLogin);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-start w-80 sm:w-96 py-5 px-7 bg-white dark:bg-zinc-700 shadow-normal rounded-xl">
      <div className="font-DanaMedium text-lg text-black dark:text-white text-center mb-6">
        ورود
      </div>
      <form action={formActionLogin} className="w-full">
        {/* username */}
        <div className="relative flex flex-col items-start justify-center w-full h-10 mb-8">
          <label
            className="absolute -top-3 right-3 w-auto h-6 px-2 text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="mobile_number"
          >
            نام کاربری
          </label>
          <input
            className={`flex items-center justify-start w-full h-full px-3 pt-1 font-sans text-black dark:text-white bg-transparent rounded border ${
              stateLogin.field?.includes("username")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            dir="ltr"
            value={dataLogin.username}
            onChange={handleUsername}
            ref={inputRef}
          />
        </div>

        {/* password */}
        <div className="relative flex flex-col items-start justify-center w-full h-10 mb-6">
          <label
            className="absolute -top-3.5 right-3 w-auto h-6 px-2 text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="mobile_number"
          >
            رمز عبور
          </label>
          <input
            className={`flex items-center justify-start w-full h-full pl-3 pr-10 pt-1 font-sans text-black dark:text-white bg-transparent rounded border ${
              stateLogin.field?.includes("password")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="off"
            dir="ltr"
            value={dataLogin.password}
            onChange={handlePassword}
          />
          <div
            onClick={handleShowPassword}
            className="absolute top-2 right-3 cursor-pointer"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-zinc-700 dark:text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-zinc-700 dark:text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </div>
        </div>

        <SubmitBtn
          title="ورود"
          style="w-full h-10 mb-3 text-center rounded-lg text-light text-white bg-orange-400 hover:bg-orange-500 transition-colors duration-150"
          isPending={isPending}
        />
      </form>
      <div className="flex items-center justify-center gap-x-1.5 text-center text-zinc-700 dark:text-gray-300">
        <div> اگر حساب کاربری ندارید ، </div>
        <Link
          href="/signup"
          className="text-orange-400 dark:text-orange-300"
        >
          ثبت‌نام کنید.
        </Link>
      </div>
    </div>
  );
};

export default UsernameAndPassword;
