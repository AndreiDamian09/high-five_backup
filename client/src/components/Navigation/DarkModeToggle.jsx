import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const hasStoredPreference = localStorage.getItem("darkMode");
    const savedMode = hasStoredPreference === "true";
    return hasStoredPreference ? savedMode : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDark);
    localStorage.setItem("darkMode", String(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((current) => !current);
  };

  return (
    <button onClick={toggleDarkMode} className="main-nav__link" title="Toggle Dark Mode" type="button">
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
