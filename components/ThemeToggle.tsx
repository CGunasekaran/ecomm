"use client";

import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      setTheme("system");
      applyTheme("system");
    }
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;

    if (newTheme === "system") {
      html.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon className="h-5 w-5" />;
      case "dark":
        return <MoonIcon className="h-5 w-5" />;
      case "system":
        return <ComputerDesktopIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    const nextTheme = { light: "dark", dark: "system", system: "light" }[theme];
    return `Switch to ${nextTheme} theme`;
  };

  if (!mounted) {
    return (
      <button className="p-2 text-muted-foreground" aria-hidden="true" disabled>
        <ComputerDesktopIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-ring"
      aria-label={getLabel()}
      title={`Current: ${theme} theme. ${getLabel()}`}
    >
      {getIcon()}
    </button>
  );
}
