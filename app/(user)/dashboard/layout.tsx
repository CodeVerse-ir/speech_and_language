import type { Metadata } from "next";
import "./globals.css";

// components
import SessionProvider from "@/context/SessionProvider";
import NextNprogress from "@/libraries/NextNprogress";
import ToastContainerComponent from "@/libraries/ToastContainerComponent";

export const metadata: Metadata = {
  title: "Kitchenware",
  description: "Kitchenware",
  icons: {
    icon: "/image/logo/kitchenware_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-Dana text-base bg-gray-100 dark:bg-zinc-800">
        <SessionProvider>
          <NextNprogress>
            {/* <Header /> */}
            {children}
            {/* <Footer /> */}
            <ToastContainerComponent />
          </NextNprogress>
        </SessionProvider>
      </body>
    </html>
  );
}
