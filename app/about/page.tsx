import type { Metadata } from "next";
import Link from "next/link";
import { location, worshipItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us — Church of Christ Brussels",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-8 py-20">
      <div className="mb-14 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Who We Are</div>
        <div className="font-serif text-[42px] font-bold text-green-dark">About Us</div>
      </div>

      <div className="mb-16 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
        <div>
          <div className="mb-3 font-serif text-[22px] font-bold text-green">What We Believe</div>
          <div className="text-[15px] leading-[1.8] text-text">
            We have no creed but Christ, no book but the Bible. We seek to be simply Christians, wearing no
            denominational name and holding only to the teaching of the New Testament as our guide for faith and
            practice.
          </div>
        </div>
        <div>
          <div className="mb-3 font-serif text-[22px] font-bold text-green">The Plan of Salvation</div>
          <div className="text-[15px] leading-[1.8] text-text">
            We believe salvation comes through hearing the Gospel, believing in Christ, repenting of sin, confessing
            His name, and being baptized for the forgiveness of sins — followed by a life of faithful discipleship.
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-7 rounded-[20px] border border-border bg-white p-9">
        <div
          className="h-24 w-24 shrink-0 rounded-full"
          style={{ background: "linear-gradient(135deg,#2C4A3D,#C79A46)" }}
        />
        <div>
          <div className="font-serif text-[24px] font-bold text-green-dark">{location.preacher}</div>
          <div className="my-1.5 text-[13px] tracking-[2px] text-gold uppercase">Preaching Minister</div>
          <div className="text-[14px] leading-[1.7] text-text">
            Joseph has served the congregation for over a decade, shepherding the church through teaching, counsel,
            and a steady example of faith lived out in daily life.
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-14">
        <div className="mb-12 text-center">
          <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Come Worship</div>
          <div className="font-serif text-[42px] font-bold text-green-dark">Join Us</div>
        </div>
        <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-12">
          <div className="flex h-full flex-col">
            <div className="mb-5 font-serif text-[26px] font-bold text-green">Our worship consists of</div>
            <div className="flex flex-1 flex-col justify-start gap-[22px]">
              {worshipItems.map((wi) => (
                <div key={wi.label} className="flex items-baseline gap-4">
                  <span className="font-serif text-[22px] font-bold text-gold">{wi.num}</span>
                  <span className="text-[18px] text-ink-soft">{wi.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-7">
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Worship Place</div>
              <div className="text-[15px] text-green-dark">{location.place}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Preacher</div>
              <div className="text-[15px] text-green-dark">{location.preacher}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Address</div>
              <div className="text-[15px] text-green-dark">{location.address}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Times</div>
              {location.times.map((t) => (
                <div key={t.day} className="text-[15px] text-green-dark">
                  {t.day}: {t.time}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Zoom</div>
              <a href={location.zoomLink} target="_blank" rel="noreferrer" className="text-[15px] font-semibold text-green no-underline">
                Join on Zoom →
              </a>
              <div className="mt-0.5 text-[12px] text-text-muted">{location.zoomNote}</div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="mb-6 font-serif text-[20px] italic text-text">
            You are warmly invited to worship with us — come as you are, you belong here.
          </div>
          <Link
            href="/contact"
            className="inline-block cursor-pointer rounded-full bg-green px-8 py-3.5 text-[14px] font-semibold text-bg no-underline"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
