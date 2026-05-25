import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return true; // dark by default
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
