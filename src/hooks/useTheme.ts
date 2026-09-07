import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.documentElement.classList.toggle("dark", theme === "dark");

    const background = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();

    // Mobile status bar color
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", `oklch(${background})`);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
