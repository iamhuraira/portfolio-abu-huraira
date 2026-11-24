import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "theme";

function stored(): Theme | null {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

const system = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a12" : "#f5f1ea");
}

/**
 * Light/dark theme. Follows the visitor's system setting until they pick one,
 * then remembers their choice. (index.html applies it before first paint.)
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => stored() ?? system());

  useEffect(() => apply(theme), [theme]);

  // keep following the system setting while the visitor hasn't chosen
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => !stored() && setTheme(system());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* private mode: still switches, just isn't remembered */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
