import SermonForm from "@/components/admin/SermonForm";
import Topbar from "@/components/admin/Topbar";

export default function NewSermonPage() {
  return (
    <div>
      <Topbar title="New Resource" backHref="/admin/sermons" />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
          <p className="mb-6 text-[13px] text-[#7C93AA]">
            Use the Category field below to post this as a Sermon, a Thought for the Week, or a Bible Teachings
            study.
          </p>
          <SermonForm />
        </div>
      </div>
    </div>
  );
}
