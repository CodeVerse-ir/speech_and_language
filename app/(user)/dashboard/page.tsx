"use client";

import { logout } from "@/actions/auth/auth";
import { useSession } from "@/utils/useSession";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const HomePage = () => {
  const { user, userContext } = useSession();
  const router = useRouter();

  return (
    <main>
      <div>صفحه اصلی</div>
      <div>{`کاربر ${user?.first_name + " " + user?.last_name} خوش آمدید`}</div>
      <button
        type="button"
        onClick={async () => {
          try {
            const data = await logout();
            if (data.status === "success") {
              router.push("/");
              userContext(null);
            }
          } catch (error) {
            console.error("Error during logout:", error);
            toast("خطا در خروج از حساب. لطفا دوباره تلاش کنید.", {
              type: "error",
            });
          }
        }}
      >
        خروج از حساب
      </button>
    </main>
  );
};

export default HomePage;
