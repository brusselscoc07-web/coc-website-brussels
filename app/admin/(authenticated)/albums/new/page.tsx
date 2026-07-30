import AlbumForm from "@/components/admin/AlbumForm";

export default function NewAlbumPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 font-serif text-[32px] font-bold text-green-dark">New Album</div>
      <AlbumForm />
      <p className="mt-4 text-[13px] text-text-muted">
        You&apos;ll be able to add photos once the album is created.
      </p>
    </div>
  );
}
