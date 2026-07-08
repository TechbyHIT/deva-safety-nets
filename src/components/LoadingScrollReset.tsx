"use client";

import { useEffect } from "react";
import { scrollPageToTop } from "@/lib/scroll-to-top";

/** Keep loading skeleton visible from the top while the next page loads. */
export function LoadingScrollReset() {
  useEffect(() => {
    scrollPageToTop();
  }, []);

  return null;
}
