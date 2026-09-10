"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/site";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => void reg.unregister());
      });
      return;
    }
    const url = withBasePath("/sw.js");
    void navigator.serviceWorker.register(url, { scope: withBasePath("/") }).catch(() => {
      /* Static hosts may ignore SW in local file previews; the site still works. */
    });
  }, []);
  return null;
}
