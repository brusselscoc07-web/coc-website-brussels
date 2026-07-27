"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { heroSlides } from "@/lib/data";

type Countdown = { days: number; hours: number; minutes: number; seconds: number; label: string };

function computeCountdown(): Countdown {
  const now = new Date();
  const target = new Date(now);
  target.setHours(12, 30, 0, 0);
  let daysUntilSun = (7 - now.getDay()) % 7;
  if (daysUntilSun === 0 && now > target) daysUntilSun = 7;
  target.setDate(now.getDate() + daysUntilSun);
  let diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);
  const dd = String(target.getDate());
  const suffix = dd.endsWith("1") && dd !== "11" ? "ST" : dd.endsWith("2") && dd !== "12" ? "ND" : dd.endsWith("3") && dd !== "13" ? "RD" : "TH";
  const label = `${target.toLocaleDateString("en-US", { month: "long" }).toUpperCase()} ${dd}${suffix}, ${target.getFullYear()}`;
  return { days, hours, minutes, seconds, label };
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const heroTimer = setInterval(() => setIndex((i) => (i + 1) % 3), 5000);
    const countdownTimer = setInterval(() => setCountdown(computeCountdown()), 1000);
    return () => {
      clearInterval(heroTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const units = countdown
    ? [
        { label: "Days", value: String(countdown.days).padStart(2, "0") },
        { label: "Hours", value: String(countdown.hours).padStart(2, "0") },
        { label: "Minutes", value: String(countdown.minutes).padStart(2, "0") },
        { label: "Seconds", value: String(countdown.seconds).padStart(2, "0") },
      ]
    : [
        { label: "Days", value: "00" },
        { label: "Hours", value: "00" },
        { label: "Minutes", value: "00" },
        { label: "Seconds", value: "00" },
      ];

  return (
    <div className="relative h-[min(88vh,760px)] min-h-[480px] overflow-hidden text-center text-bg">
      <div
        className="flex h-full w-[300%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateX(-${index * (100 / 3)}%)` }}
      >
        {heroSlides.map((slide) => (
          <div key={slide.headline} className="relative flex h-full w-1/3 shrink-0 items-center justify-center">
            <div className="absolute inset-0" style={{ background: slide.gradient }} />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(27,46,37,0.15), rgba(27,46,37,0.55))" }}
            />
            <div className="relative z-[2] max-w-[720px] px-6 pb-[150px]">
              <div className="mb-[18px] text-[13px] tracking-[4px] text-gold-light uppercase">Welcome</div>
              <div className="mb-[18px] font-serif text-[clamp(38px,6vw,64px)] font-bold leading-[1.05]">
                {slide.headline}
              </div>
              <div className="mb-9 text-[18px] text-bg-alt">{slide.sub}</div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/join"
                  className="cursor-pointer rounded-full bg-gold px-[30px] py-3.5 text-[15px] font-semibold text-green-dark no-underline"
                >
                  Join Us
                </Link>
                <Link
                  href="/contact"
                  className="cursor-pointer rounded-full border-[1.5px] border-bg-alt px-[30px] py-3.5 text-[15px] text-bg-alt no-underline"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i + 2) % 3)}
        className="absolute left-5 top-1/2 z-[3] -translate-y-1/2 cursor-pointer text-[30px] text-bg-alt"
      >
        ‹
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % 3)}
        className="absolute right-5 top-1/2 z-[3] -translate-y-1/2 cursor-pointer text-[30px] text-bg-alt"
      >
        ›
      </button>

      <div className="absolute bottom-16 left-0 right-0 z-[3] flex justify-center px-5">
        <div className="flex w-[min(560px,92%)] flex-wrap items-center justify-center gap-[26px] rounded-2xl bg-[rgba(20,22,18,0.55)] px-[30px] py-3.5 backdrop-blur-sm">
          <div className="text-left">
            <div className="inline-block border-b-2 border-gold pb-[3px] text-[13px] font-bold tracking-[0.5px] text-bg uppercase">
              Sunday Service Live
            </div>
            <div className="mt-1 text-[10.5px] tracking-[1.2px] text-gold-light uppercase">
              {countdown ? countdown.label : ""}
            </div>
          </div>
          <div className="flex gap-[26px]">
            {units.map((u) => (
              <div key={u.label} className="text-center">
                <div className="font-serif text-[26px] font-bold leading-none text-gold">{u.value}</div>
                <div className="mt-1 text-[9px] tracking-[1px] text-bg uppercase">{u.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-[3] flex justify-center gap-2.5">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.headline}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className="inline-block h-2 cursor-pointer rounded-full transition-all duration-300"
            style={{ width: i === index ? "24px" : "8px", background: i === index ? "#C79A46" : "rgba(241,233,216,0.4)" }}
          />
        ))}
      </div>
    </div>
  );
}
