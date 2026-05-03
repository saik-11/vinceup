"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

function getInitialTheme(defaultTheme) {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  return localStorage.getItem("theme") ?? defaultTheme;
}

function resolveTheme(theme) {
  if (typeof window === "undefined") {
    return "light";
  }

  return theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
}

export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [theme, setThemeState] = useState(() => getInitialTheme(defaultTheme));
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(getInitialTheme(defaultTheme)));

  useEffect(() => {
    const applyTheme = (newTheme) => {
      const root = window.document.documentElement;
      const nextResolvedTheme = resolveTheme(newTheme);

      root.classList.remove("light", "dark");
      root.classList.add(nextResolvedTheme);
      root.style.colorScheme = nextResolvedTheme;
      setResolvedTheme(nextResolvedTheme);
    };

    applyTheme(theme);

    // Save to local storage
    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
