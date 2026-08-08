"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { gradients } from "@/lib/data";
import type { HeroSlide } from "@/lib/settings";

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

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const count = slides.length || 1;

  useEffect(() => {
    const heroTimer = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    const countdownTimer = setInterval(() => setCountdown(computeCountdown()), 1000);
    return () => {
      clearInterval(heroTimer);
      clearInterval(countdownTimer);
    };
  }, [count]);

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

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[min(74vh,760px)] min-h-[420px] overflow-hidden text-center text-bg min-[880px]:h-[min(88vh,760px)] min-[880px]:min-h-[480px]">
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ width: `${count * 100}%`, transform: `translateX(-${index * (100 / count)}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative flex h-full shrink-0 items-center justify-center"
            style={{ width: `${100 / count}%` }}
          >
            <div
              className="absolute inset-0"
              style={
                slide.imageUrl
                  ? { backgroundImage: `url(${slide.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: gradients[i % gradients.length] }
              }
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(27,46,37,0.15), rgba(27,46,37,0.55))" }}
            />
            <div className="relative z-[2] max-w-[720px] px-6 pb-[110px] min-[880px]:pb-[150px]">
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
              <div className="mt-5 flex justify-center min-[880px]:hidden">
                <svg
                  className="animate-bounce opacity-80"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#F1E9D8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i + count - 1) % count)}
            className="absolute left-5 top-1/2 z-[3] -translate-y-1/2 cursor-pointer text-[30px] text-bg-alt"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-5 top-1/2 z-[3] -translate-y-1/2 cursor-pointer text-[30px] text-bg-alt"
          >
            ›
          </button>
        </>
      )}

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

      {count > 1 && (
        <div className="absolute bottom-5 left-0 right-0 z-[3] flex justify-center gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="inline-block h-2 cursor-pointer rounded-full transition-all duration-300"
              style={{ width: i === index ? "24px" : "8px", background: i === index ? "#C79A46" : "rgba(241,233,216,0.4)" }}
            />
          ))}
        </div>
      )}

    </div>
  );
}
