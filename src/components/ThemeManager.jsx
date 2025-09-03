import { useEffect } from "react";

export default function ThemeManager() {
  useEffect(() => {
    const applyTheme = () => {
      try {
        const stored = localStorage.getItem("darkMode");
        const useDark = stored === "true";
        const html = document.documentElement;
        html.classList.toggle("dark", useDark);
        html.style.colorScheme = useDark ? "dark" : "light";
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", useDark ? "#0f172a" : "#ffffff");

        // Notificar a otros componentes
        window.dispatchEvent(new CustomEvent("theme:applied", { detail: { dark: useDark } }));
      } catch (e) {
        console.warn("ThemeManager.applyTheme failed:", e);
      }
    };

    applyTheme();
    window.addEventListener("astro:after-swap", applyTheme);
    window.addEventListener("astro:page-load", applyTheme);
    window.addEventListener("storage", (e) => e.key === "darkMode" && applyTheme());

    return () => {
      window.removeEventListener("astro:after-swap", applyTheme);
      window.removeEventListener("astro:page-load", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return null;
}
