import React, { useRef, useState } from "react";

const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(defaultOpen ? "auto" : 0);
  const contentRef = useRef(null);
  const panelId = React.useId();
  const headingId = React.useId();

  const toggle = () => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      // CERRAR: de altura actual → 0 (con animación)
      const current = el.scrollHeight;
      setHeight(current); // fijar altura actual
      requestAnimationFrame(() => setHeight(0)); // luego animar a 0
      setIsOpen(false);
    } else {
      // ABRIR: de 0 → scrollHeight (con animación)
      const target = el.scrollHeight;
      setHeight(target);
      setIsOpen(true);
    }
  };

  const onTransitionEnd = () => {
    // Al terminar: si está abierto, quitar altura fija (auto) para contenido dinámico
    if (isOpen) setHeight("auto");
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 shadow-sm">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 p-4 text-left 
                   text-neutral-900 dark:text-neutral-100 rounded-xl
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500"
        aria-expanded={isOpen}
        aria-controls={panelId}
        id={headingId}
        onClick={toggle}
      >
        <span className="text-lg md:text-xl font-semibold">{question}</span>
        {/* Chevron con rotación */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </button>

      {/* Panel animado */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        ref={contentRef}
        style={{ height }}
        onTransitionEnd={onTransitionEnd}
        className={`overflow-hidden transition-[height] duration-300 ease-out`}
      >
        <div className={`px-4 pb-4 pt-0 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
