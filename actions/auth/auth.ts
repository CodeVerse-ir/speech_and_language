"use server";

import db from "@/utils/database";
import {
  createHash,
  createJWT,
  decodeJWT,
  generateRandomOTP,
} from "@/utils/helper";
import { cookies } from "next/headers";

interface loginProps {
  status: string | null;
  message: string | undefined | null;
  field: string[] | null;
}

interface checkOtpProps {
  status: string | null;
  message: string | undefined | null;
  field: string[] | null;
  user: {
    username: string;
    first_name: string;
    last_name: string;
    parent_role: string;
    mobile_number: string;
  };
}

interface resendOtpProps {
  status: string | null;
}

interface meProps {
  user: {
    username: string;
    first_name: string;
    last_name: string;
    parent_role: string;
    mobile_number: string;
  } | null;
}

const getStringValue = (value: FormDataEntryValue | null): string => {
  return value === null ? "" : String(value);
};

async function login(
  prevState: loginProps,
  formData: FormData
): Promise<loginProps> {
  const username = getStringValue(formData.get("username"));
  const password = getStringValue(formData.get("password"));

  console.log("login username : ", username);
  console.log("login password : ", password);

  const emptyFields: string[] = [];
  const message: string[] = [];

  if (username === null || username === "") {
    emptyFields.push("username");
    message.push("نام کاربری");
  }
  if (password === null || password === "") {
    emptyFields.push("password");
    message.push("رمز عبور");
  }

  if (emptyFields.length > 0) {
    return {
      ...prevState,
      status: "error",
      message: `${message.join(" و ")} الزامی است.`,
      field: emptyFields,
    };
  }

  if (username.length < 5) {
    return {
      ...prevState,
      status: "error",
      message: "نام کاربری باید حداقل 5 کاراکتر باشد.",
      field: ["username"],
    };
  }

  if (password.length < 8) {
    return {
      ...prevState,
      status: "error",
      message: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      field: ["password"],
    };
  }

  try {
    const now = new Date();
    const twoMinutesLater = new Date(now.getTime() + 2 * 60000);
    const hashedPassword = createHash(password);

    const users = await db.query(
      "SELECT id FROM users WHERE username = ? AND password = ? AND active = ?",
      [username, hashedPassword, true]
    );

    if (users.length === 0) {
      return {
        ...prevState,
        status: "error",
        message: "نام کاربری یا رمز عبور نادرست است.",
      };
    }

    const user_id = users[0].id;

    const otpCode = generateRandomOTP();
    const result = await db.query(
      "UPDATE users SET otp_code = ?, otp_validity_time = ? WHERE id = ?",
      [otpCode, twoMinutesLater, user_id]
    );

    if (result.affectedRows === 1) {
      const payload = {
        user_id,
        created_at: now,
      };
      const token = createJWT(payload);

      if (token) {
        const cookieStore = await cookies();
        cookieStore.set({
          name: "login_token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        return {
          ...prevState,
          status: "success",
          message: "کد ورود برای شما ارسال شد.",
        };
      }
    }

    return {
      ...prevState,
      status: "error",
      message: "نام کاربری یا رمز عبور نادرست است.",
    };
  } catch (error) {
    console.error("خطا در هنگام ورود:", error);
    return {
      ...prevState,
      status: "error",
      message: "مشکلی در ارتباط با سرور رخ داده است. لطفا دوباره تلاش کنید.",
    };
  }
}

async function checkOtp(
  prevState: checkOtpProps,
  formData: FormData
): Promise<checkOtpProps> {
  const otp0 = getStringValue(formData.get("otp0"));
  const otp1 = getStringValue(formData.get("otp1"));
  const otp2 = getStringValue(formData.get("otp2"));
  const otp3 = getStringValue(formData.get("otp3"));
  const otp4 = getStringValue(formData.get("otp4"));

  if (otp0 === "" || otp1 === "" || otp2 === "" || otp3 === "" || otp4 === "") {
    return {
      ...prevState,
      status: "error",
      message: "کد ورود الزامی است.",
      field: ["otp"],
    };
  }

  const verification_code = otp0 + otp1 + otp2 + otp3 + otp4;
  console.log("sign up verification_code : ", verification_code);

  try {
    const cookieStore = await cookies();
    const login_token = cookieStore.get("login_token");

    if (login_token) {
      const tokenValue = login_token.value;
      const decodedToken = decodeJWT(tokenValue);

      if (decodedToken) {
        const user_id = decodedToken.user_id;

        const users = await db.query("SELECT * FROM users WHERE id = ?", [
          user_id,
        ]);

        if (users.length > 0) {
          const user = users[0];
          console.log("login otp_code : ", user.otp_code);

          if (verification_code === user.otp_code) {
            const now = new Date();
            const otpExpiry = new Date(user.otp_validity_time);

            if (otpExpiry < now) {
              return {
                ...prevState,
                status: "error",
                message:
                  "زمان اعتبار کد گذشته است ، روی دکمه دریافت مجدد کد کلیک کنید.",
                field: ["otp"],
              };
            }

            await db.query("UPDATE users SET otp_code = ? WHERE id = ?", [
              0,
              user_id,
            ]);

            cookieStore.delete("login_token");

            const payload = {
              user_id,
              username: user.username,
              created_at: new Date(),
            };
            const token = createJWT(payload);

            if (token) {
              cookieStore.set({
                name: "token",
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
              });

              return {
                ...prevState,
                status: "success",
                message: "شما با موفقیت وارد شدید.",
                field: [],
                user: {
                  username: user.username,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  parent_role: user.parent_role,
                  mobile_number: user.mobile_number,
                },
              };
            }
          }
        }
      }
    }

    return {
      ...prevState,
      status: "error",
      message: "کد ورود نادرست است.",
      field: ["otp"],
    };
  } catch (error) {
    console.error("خطا در هنگام ورود:", error);
    return {
      ...prevState,
      status: "error",
      message: "مشکلی در ارتباط با سرور رخ داده است. لطفا دوباره تلاش کنید.",
    };
  }
}

async function resendOtp(): Promise<resendOtpProps> {
  const cookieStore = await cookies();
  const login_token = cookieStore.get("login_token");

  if (!login_token) {
    return { status: "error" };
  }

  try {
    const decodedToken = decodeJWT(login_token.value);
    if (!decodedToken?.user_id) {
      return { status: "error" };
    }

    const newOtp = generateRandomOTP();
    const expiryTime = new Date(Date.now() + 2 * 60000);

    const result = await db.query(
      "UPDATE users SET otp_code = ?, otp_validity_time = ? WHERE id = ?",
      [newOtp, expiryTime, decodedToken.user_id]
    );

    return result.affectedRows === 1
      ? { status: "success" }
      : { status: "error" };
  } catch (error) {
    console.error("خطا در ارسال مجدد کد:", error);
    return { status: "error" };
  }
}

async function me(): Promise<meProps> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      const tokenValue = token.value;
      const decodedToken = decodeJWT(tokenValue);

      if (decodedToken) {
        const user_id = decodedToken.user_id;
        const username = decodedToken.username;

        if (user_id && username) {
          const user = await db.query(
            `SELECT 
            first_name, 
            last_name, 
            parent_role,
            mobile_number, 
            username
          FROM users 
          WHERE id = ?`,
            [user_id]
          );

          if (user && user.length > 0) {
            return {
              user: {
                username: user[0].username,
                first_name: user[0].first_name,
                last_name: user[0].last_name,
                parent_role: user[0].parent_role,
                mobile_number: user[0].mobile_number,
              },
            };
          }
        }
      }

      // بررسی مجدد کوکی و حذف آن در صورت وجود
      const hasCookie = cookieStore.has("token");
      if (hasCookie) {
        cookieStore.delete("token");
      }
      return {
        user: null,
      };
    } catch (error) {
      console.error("خطا در هنگام ورود:", error);
      return {
        user: null,
      };
    }
  } else {
    return {
      user: null,
    };
  }
}

async function logout() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("token");

  if (hasCookie) {
    cookieStore.delete("token");
  }

  return {
    status: "success",
  };
}

export { login, checkOtp, resendOtp, me, logout };
