"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NextNprogress = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#fdba74"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NextNprogress;
