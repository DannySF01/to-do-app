import { useEffect, useState } from "react";

type Theme = "system" | "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "system",
  );

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      const dark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      document.documentElement.classList.toggle("dark", dark);

      // Update PWA/system bar
      const themeColor = dark ? "#09090b" : "#faf9f7";

      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", themeColor);
    };

    updateTheme();

    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
