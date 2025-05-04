import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { usernameAndPassword } from "@/actions/auth/signup";

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

interface UsernameAndPasswordProps {
  setStep: Dispatch<SetStateAction<number>>;
  dataSignup: UserInformation;
  setDataSignup: Dispatch<SetStateAction<UserInformation>>;
}

const INITIAL_STATE_USERNAME_AND_PASSWORD = {
  status: null,
  message: null,
  field: null,
  error_code: 0,
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

const UsernameAndPassword: React.FC<UsernameAndPasswordProps> = ({
  setStep,
  dataSignup,
  setDataSignup,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat_password, setShowRepeat_password] = useState(false);

  const [dataUsernameAndPassword, setdataUsernameAndPassword] = useState<{
    username: string;
    password: string;
    repeat_password: string;
  }>({
    username: dataSignup.username || "",
    password: dataSignup.password || "",
    repeat_password: dataSignup.repeat_password || "",
  });

  const [stateUsernameAndPassword, formActionUsernameAndPassword, isPending] =
    useActionState(usernameAndPassword, INITIAL_STATE_USERNAME_AND_PASSWORD);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    toast(stateUsernameAndPassword?.message, {
      type: `${getToastType(stateUsernameAndPassword?.status)}`,
    });

    console.log(
      "sign up stateUsernameAndPassword : ",
      stateUsernameAndPassword
    );

    if (stateUsernameAndPassword?.status === "success") {
      setDataSignup((prevUser) => ({
        ...prevUser,
        ...stateUsernameAndPassword.user_information,
      }));
      setStep(3);
    } else if (stateUsernameAndPassword?.status === "error") {
      // mobile_number
      if (stateUsernameAndPassword?.error_code === 1) {
        setStep(1);
      }
    }
  }, [stateUsernameAndPassword, setStep, setDataSignup]);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newdataSignUp = { ...dataUsernameAndPassword };
    const usernameValue = e.target.value;
    const pattern = /^[0-9a-z_]*$/;
    if (pattern.test(usernameValue) && usernameValue.length <= 20) {
      newdataSignUp.username = usernameValue;
      setdataUsernameAndPassword(newdataSignUp);
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newdataSignUp = { ...dataUsernameAndPassword };
    const passwordValue = e.target.value;
    const pattern = /^[0-9a-zA-Z\-_*@#\$%]*$/;
    if (pattern.test(passwordValue) && passwordValue.length <= 20) {
      newdataSignUp.password = passwordValue;
      setdataUsernameAndPassword(newdataSignUp);
    }
  };

  const handleRepeat_password = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newdataSignUp = { ...dataUsernameAndPassword };
    const repeat_passwordValue = e.target.value;
    const pattern = /^[0-9a-zA-Z\-_*@#\$%]*$/;
    if (
      pattern.test(repeat_passwordValue) &&
      repeat_passwordValue.length <= 20
    ) {
      newdataSignUp.repeat_password = repeat_passwordValue;
      setdataUsernameAndPassword(newdataSignUp);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowRepeat_password = () => {
    setShowRepeat_password(!showRepeat_password);
  };

  return (
    <div className="flex flex-col items-center justify-start w-80 sm:w-96 py-5 px-7 bg-white dark:bg-zinc-700 shadow-normal rounded-xl">
      <div className="font-DanaMedium text-lg text-black dark:text-white text-center mb-6">
        ثبت نام‌کاربری و رمز عبور
      </div>
      <form action={formActionUsernameAndPassword} className="w-full">
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
              stateUsernameAndPassword.field?.includes("username")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            dir="ltr"
            value={dataUsernameAndPassword.username}
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
              stateUsernameAndPassword.field?.includes("password")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="off"
            dir="ltr"
            value={dataUsernameAndPassword.password}
            onChange={handlePassword}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "v") {
                e.preventDefault(); // Ctrl + V
              }
            }}
          />
          <button
            type="button"
            onClick={handleShowPassword}
            className="absolute top-2 right-3 cursor-pointer"
            tabIndex={-1} // not select by TAB
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
          </button>
        </div>

        {/* repeat_password */}
        <div className="relative flex flex-col items-start justify-center w-full h-10 mb-6">
          <label
            className="absolute -top-3 right-3 w-auto h-6 px-2 text-zinc-700 dark:text-gray-300 bg-white dark:bg-zinc-700"
            htmlFor="mobile_number"
          >
            تکرار رمز عبور
          </label>
          <input
            className={`flex items-center justify-start w-full h-full pl-3 pr-10 pt-1 font-sans text-black dark:text-white bg-transparent rounded border ${
              stateUsernameAndPassword.field?.includes("repeat_password")
                ? "border-red-500"
                : "border-gray-400"
            } focus:border-orange-300 transition-colors duration-150 outline-none`}
            type={showRepeat_password ? "text" : "password"}
            id="repeat_password"
            name="repeat_password"
            autoComplete="off"
            dir="ltr"
            value={dataUsernameAndPassword.repeat_password}
            onChange={handleRepeat_password}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "v") {
                e.preventDefault(); // Ctrl + V
              }
            }}
          />
          <button
            type="button"
            onClick={handleShowRepeat_password}
            className="absolute top-2 right-3 cursor-pointer"
            tabIndex={-1} // not select by TAB
          >
            {showRepeat_password ? (
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
          </button>
        </div>

        {/* first_name */}
        <input
          id="first_name"
          name="first_name"
          type="hidden"
          value={dataSignup.first_name}
        />
        {/* last_name */}
        <input
          id="last_name"
          name="last_name"
          type="hidden"
          value={dataSignup.last_name}
        />
        {/* mobile_number */}
        <input
          id="mobile_number"
          name="mobile_number"
          type="hidden"
          value={dataSignup.mobile_number}
        />

        <SubmitBtn
          title="ثبت"
          style="w-full h-10 mb-3 text-center rounded-lg text-light text-white bg-orange-400 hover:bg-orange-500 transition-colors duration-150"
          isPending={isPending}
        />
      </form>
      <button
        onClick={() => setStep(1)}
        className="flex items-center justify-center text-center text-zinc-700 dark:text-gray-300"
      >
        برگشت
      </button>
    </div>
  );
};

export default UsernameAndPassword;
