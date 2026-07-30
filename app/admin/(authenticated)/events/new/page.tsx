import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 font-serif text-[32px] font-bold text-green-dark">New Event</div>
      <EventForm />
    </div>
  );
}
