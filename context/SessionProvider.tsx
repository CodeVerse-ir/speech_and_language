"use client";

import { me } from "@/actions/auth/auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface User {
  username?: string;
  first_name?: string;
  last_name?: string;
  parent_role?: string;
  mobile_number?: string;
}

interface SessionContextType {
  user: User | null;
  userContext: (
    user: User | null | ((prev: User | null) => User | null)
  ) => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export const SessionProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const data = await me();
      setUser(data.user);
      if (!data.user && pathname.startsWith("/dashboard")) {
        router.push("/");
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [router, pathname]);

  const userContext = (
    user: User | null | ((prev: User | null) => User | null)
  ) => {
    if (typeof user === "function") {
      setUser((prev) => user(prev));
    } else {
      setUser(user);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen background">
        <div className="flex items-center justify-center gap-x-1">
          <h1 className="font-MorabbaBold text-lg md:text-xl lg:text-2xl text-orange-500">
            <span>منتظر بمانید</span>
          </h1>

          <div className="flex items-center justify-center w-12 h-1 gap-x-1 child:size-2 child:rounded-full child:bg-orange-500">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ user, userContext }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
