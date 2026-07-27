import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";

export const metadata: Metadata = {
  title: "Join Us — Church of Christ Brussels",
};

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-[900px] px-8 py-20">
      <div className="mb-4 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Get In Touch</div>
        <div className="font-serif text-[38px] font-bold text-green-dark">Contact Us</div>
      </div>
      <div className="mb-12 text-center font-serif text-[17px] italic text-text-muted">
        &quot;And you shall know the truth, and the truth shall make you free.&quot; — John 8:32
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-12">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}
