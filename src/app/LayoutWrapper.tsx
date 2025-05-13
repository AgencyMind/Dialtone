"use client";

import React, { useEffect } from "react";
import Modals from "@/components/Modals/modules/Modals";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Toggle this boolean when ready to reveal the app
  const showApp = false;

  useEffect(() => {
    if (!showApp) {
      document.documentElement.classList.add('gradient-only');
    } else {
      document.documentElement.classList.remove('gradient-only');
    }
  }, [showApp]);

  if (!showApp) {
    return null;
  }

  return (
    <>
      {children}
      <Modals />
    </>
  );
}
