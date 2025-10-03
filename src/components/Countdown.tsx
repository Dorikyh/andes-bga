// src/components/Countdown.tsx
import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2025-10-07T13:00:00-05:00");

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate.getTime() - new Date().getTime();
    let time = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      time = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return time;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const boxes = [
    { label: "Días", value: timeLeft.days, className: "" },
    { label: "Horas", value: timeLeft.hours, className: "" },
    { label: "Min", value: timeLeft.minutes, className: "" },
    { label: "Seg", value: timeLeft.seconds, className: "hidden md:block" }, 
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 text-center">
      {boxes.map((box, idx) => (
        <div
          key={idx}
          className={`w-20 md:w-28 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-lg p-4 transform transition-all duration-500 hover:scale-105 ${box.className}`}
        >
          <p className="text-3xl md:text-5xl font-extrabold animate-pulse">
            {box.value}
          </p>
          <span className="text-sm md:text-base">{box.label}</span>
        </div>
      ))}
    </div>
  );
}
