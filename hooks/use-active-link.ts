"use client";

import { usePathname } from "next/navigation";

export default function useActiveLink(path: string, deep: boolean = true) {
  const pathname = usePathname();

  // Link externo
  const isExternalLink = path.includes("http");

  if (!path) {
    return { active: false, isExternalLink };
  }

  // Equivalente a matchPath({ end: true })
  const normalActive = pathname === path;

  // Equivalente a matchPath({ end: false })
  const deepActive =
    pathname === path || pathname.startsWith(path + "/");

  return {
    active: deep ? deepActive : normalActive,
    isExternalLink,
  };
}
