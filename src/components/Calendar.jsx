// src/components/Calendar.jsx
import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/calendar.css";

export default function Calendar({ events }) {
  const calRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  // Detecta modo oscuro inicial y cambios en el classList del <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const check = () => setIsDark(root.classList.contains("dark"));
    check();

    const mo = new MutationObserver(() => check());
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // Render personalizado para eventos (más info en tooltip / small preview)
  const renderEventContent = (arg) => {
    const { event } = arg;
    const ext = event.extendedProps || {};
    return (
      <div className="fc-event-custom">
        <div className="fc-event-title">{event.title}</div>
        {ext.location && <div className="fc-event-sub">{ext.location}</div>}
      </div>
    );
  };

  return (
    <div className={isDark ? "fc-wrapper dark-mode" : "fc-wrapper"}>
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth"
        }}
        events={events}
        eventClick={(info) => {
          if (info.event.url) {
            info.jsEvent.preventDefault();
            window.location.href = info.event.url;
          }
        }}
        eventContent={renderEventContent}
        height="auto"
        dayMaxEventRows={3}
        expandRows={true}
        nowIndicator={true}
        eventDisplay="block"
      />
    </div>
  );
}
