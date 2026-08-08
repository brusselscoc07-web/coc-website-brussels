import EventForm from "@/components/admin/EventForm";
import Topbar from "@/components/admin/Topbar";

export default function NewEventPage() {
  return (
    <div>
      <Topbar title="New Event" backHref="/admin/events" />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
          <EventForm />
        </div>
      </div>
    </div>
  );
}
