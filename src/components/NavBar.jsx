import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Instagram, Twitter, Moon, Sun } from "react-feather";
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (typeof window === "undefined") return false;
      const stored = localStorage.getItem("darkMode");
      if (stored === "true") return true;
      if (stored === "false") return false;
      if (document.documentElement.classList.contains("dark")) return true;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      return false;
    }
  });
  const firstMenuItemRef = useRef(null);

  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Actividades", href: "/actividades" },
    { label: "Conócenos", href: "/wip" },
    { label: "Archivo", href: "/archivo" },
  ];

  useEffect(() => {
    try {
      const htmlHasDark = document.documentElement.classList.contains("dark");
      if (htmlHasDark !== darkMode) setDarkMode(htmlHasDark);
    } catch (e) {}
  }, []);
const toggleDarkMode = () => {
  setDarkMode((prev) => {
    const next = !prev;
    try {
      if (next) {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0f172a");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
      }
      localStorage.setItem("darkMode", next ? "true" : "false");
      document.cookie = `darkMode=${next ? "true" : "false"}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;

      // inform other islands/components
      window.dispatchEvent(new CustomEvent("theme:applied", { detail: { dark: next } }));
    } catch (e) {
      console.warn("No se pudo persistir darkMode:", e);
    }
    return next;
  });
};
useEffect(() => {
  const sync = () => {
    try {
      const htmlHasDark = document.documentElement.classList.contains("dark");
      setDarkMode(!!htmlHasDark);
    } catch (e) {}
  };
  window.addEventListener("theme:applied", sync);
  window.addEventListener("astro:after-swap", sync);

  return () => {
    window.removeEventListener("theme:applied", sync);
    window.removeEventListener("astro:after-swap", sync);
  };
}, []);
  // Escape key cierra el menú
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Bloquea scroll cuando el menú está abierto
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstMenuItemRef.current?.focus(), 120);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const panel = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm transition-colors">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4 md:p-4">

        {/* logo */}
        <a href="/" className="flex items-center gap-3">
          <img src="/icon.svg" alt="ANDES Logo" className="w-56 rounded-md shadow-sm" />
        </a>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {menuItems.map((m) => (
              <li key={m.label}>
                <a
                  href={m.href}
                  className="font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                >
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* right controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <a href="https://instagram.com/andesantander" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-secondary transition-colors">
              <Instagram width={20} height={20} strokeWidth={2.2} />
            </a>
            <a href="https://x.com/santanderandes" target="_blank" rel="noreferrer" aria-label="X / Twitter" className="hover:text-secondary transition-colors">
              <Twitter width={20} height={20} strokeWidth={2.2} />
            </a>
          </div>

          <a
            href="https://chat.whatsapp.com/HMRPmy1mlD88tbhSI1oZBD"
            className="hidden md:inline-flex items-center gap-2 bg-primary text-white font-bold px-3 py-2 rounded-lg shadow-sm hover:brightness-95 transition"
          >
            <UserPlus width={16} height={16} strokeWidth={2.2} />
            <span>Unirme</span>
          </a>

          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:scale-105 transform transition-transform"
          >
            {darkMode ? <Sun width={18} height={18} /> : <Moon width={18} height={18} />}
          </button>

          <button
            onClick={() => setIsOpen((s) => !s)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden p-2 rounded-md focus:ring-2 focus:ring-yellow-300"
          >
            <span className="sr-only">Abrir menú</span>
            {isOpen ? (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdrop}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-20 bg-black/30 dark:bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            <motion.div
              id="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panel}
              transition={{ duration: 0.18 }}
              className="fixed z-30 left-4 right-4 top-20 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-4 md:hidden"
              role="dialog"
              aria-modal="true"
            >
              <nav className="flex flex-col gap-3">
                {menuItems.map((m, idx) => (
                  <a
                    key={m.label}
                    href={m.href}
                    ref={idx === 0 ? firstMenuItemRef : null}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-3 font-semibold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-neutral-800/40 hover:scale-[1.01] transition-transform shadow-sm"
                  >
                    {m.label}
                  </a>
                ))}

                <a
                  href="https://chat.whatsapp.com/HMRPmy1mlD88tbloZBD"
                  onClick={() => setIsOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 bg-yellow-500 text-black font-bold shadow-md hover:brightness-95 transition"
                >
                  <UserPlus width={16} height={16} strokeWidth={2.2} />
                  <span>Unirme</span>
                </a>

                <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-200 dark:border-neutral-800/60 mt-2">
                  <a href="https://instagram.com/andesantander" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
                    <Instagram width={18} height={18} />
                  </a>
                  <a href="https://x.com/santanderandes" target="_blank" rel="noreferrer" className="p2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
                    <Twitter width={18} height={18} />
                  </a>

                  <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
                    {darkMode ? <Sun width={18} height={18} /> : <Moon width={18} height={18} />}
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">© {new Date().getFullYear()} ANDES</p>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
