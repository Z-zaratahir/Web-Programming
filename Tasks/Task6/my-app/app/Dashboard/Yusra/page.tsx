"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        {showText ? (
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Hello Yusra
          </h1>
        ) : (
          <p className="text-lg text-zinc-500">Loading...</p>
        )}
      </div>
    </div>
  );
}