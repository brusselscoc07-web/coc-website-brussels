import SermonForm from "@/components/admin/SermonForm";

export default function NewSermonPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-1 font-serif text-[32px] font-bold text-green-dark">New Resource</div>
      <p className="mb-8 text-[13px] text-text-muted">
        Use the Category field below to post this as a Sermon, a Thought for the Week, or a Bible Teachings study.
      </p>
      <SermonForm />
    </div>
  );
}
