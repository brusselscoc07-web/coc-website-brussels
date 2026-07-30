import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AddPhotoForm from "@/components/admin/AddPhotoForm";
import AlbumForm from "@/components/admin/AlbumForm";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { getDb } from "@/lib/db";
import { albums as albumsTable, photos as photosTable } from "@/lib/db/schema";
import { deletePhoto } from "../actions";

export const dynamic = "force-dynamic";

export default async function ManageAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [album] = await db.select().from(albumsTable).where(eq(albumsTable.id, id));
  if (!album) notFound();

  const albumPhotos = await db
    .select()
    .from(photosTable)
    .where(eq(photosTable.albumId, id))
    .orderBy(asc(photosTable.sortOrder));

  return (
    <div className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 font-serif text-[32px] font-bold text-green-dark">Manage Album</div>
      <AlbumForm album={album} />

      <div className="mt-12 border-t border-border pt-10">
        <div className="mb-5 font-serif text-[22px] font-bold text-green-dark">Add a Photo</div>
        <AddPhotoForm albumId={album.id} />
      </div>

      <div className="mt-10">
        <div className="mb-5 font-serif text-[22px] font-bold text-green-dark">Photos ({albumPhotos.length})</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {albumPhotos.map((ph) => (
            <div key={ph.id} className="overflow-hidden rounded-[10px] border border-border bg-white">
              <img src={ph.url} alt={ph.caption ?? ""} className="h-32 w-full object-cover" />
              <div className="p-2.5">
                {ph.caption && <div className="mb-1.5 truncate text-[12px] text-text">{ph.caption}</div>}
                <form action={deletePhoto.bind(null, album.id, ph.id)}>
                  <ConfirmSubmitButton confirmText="Delete this photo?" className="cursor-pointer text-[12px] font-semibold text-live">
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
          {albumPhotos.length === 0 && <div className="text-[14px] text-text-muted">No photos yet.</div>}
        </div>
      </div>
    </div>
  );
}
