"use client";

import { useContext } from "react";
import { SessionContext } from "@/context/SessionProvider";

export function useSession() {
  const session = useContext(SessionContext);

  if (session === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return session;
}
