import AlbumForm from "@/components/admin/AlbumForm";
import Topbar from "@/components/admin/Topbar";

export default function NewAlbumPage() {
  return (
    <div>
      <Topbar title="New Album" backHref="/admin/albums" />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
          <AlbumForm />
          <p className="mt-4 text-[13px] text-[#7C93AA]">You&apos;ll be able to add photos once the album is created.</p>
        </div>
      </div>
    </div>
  );
}
