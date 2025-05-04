"use client";

import { useEffect, useState } from "react";

interface NoScrollProps {
  noScroll: boolean;
}

const NoScroll: React.FC<NoScrollProps> = ({ noScroll }) => {
  const [windowResize, setWindowResize] = useState(0);

  useEffect(() => {
    document.body.style.overflow = noScroll ? "hidden" : "auto";

    const handleResize = () => {
      document.body.style.overflow = noScroll ? "hidden" : "auto";
      setWindowResize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [noScroll, windowResize]);

  return null;
};

export default NoScroll;
