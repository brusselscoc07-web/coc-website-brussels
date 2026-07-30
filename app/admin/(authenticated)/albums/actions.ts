"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb } from "@/lib/db";
import { albums, photos } from "@/lib/db/schema";
import { deleteImage } from "@/lib/storage";
import { uploadFormImage } from "@/lib/upload";
import { albumSchema, photoSchema } from "@/lib/validation/album";

export type AlbumFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function str(value: FormDataEntryValue | null): string | undefined {
  return value === null ? undefined : String(value);
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export async function createAlbum(_prevState: AlbumFormState, formData: FormData): Promise<AlbumFormState> {
  await requireAdminSession();
  const parsed = albumSchema.safeParse({
    id: str(formData.get("id")),
    title: str(formData.get("title")),
    albumDate: str(formData.get("albumDate")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const db = await getDb();
  const [existing] = await db.select({ id: albums.id }).from(albums).where(eq(albums.id, parsed.data.id));
  if (existing) {
    return { error: "That slug is already in use — pick a different one.", fieldErrors: { id: "Already in use" } };
  }

  await db.insert(albums).values(parsed.data);
  revalidatePath("/gallery");
  redirect(`/admin/albums/${parsed.data.id}`);
}

export async function updateAlbum(
  id: string,
  _prevState: AlbumFormState,
  formData: FormData,
): Promise<AlbumFormState> {
  await requireAdminSession();
  const parsed = albumSchema.safeParse({
    id,
    title: str(formData.get("title")),
    albumDate: str(formData.get("albumDate")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const db = await getDb();
  await db
    .update(albums)
    .set({ title: parsed.data.title, albumDate: parsed.data.albumDate })
    .where(eq(albums.id, id));

  revalidatePath("/gallery");
  revalidatePath(`/gallery/${id}`);
  redirect(`/admin/albums/${id}`);
}

export async function deleteAlbum(id: string) {
  await requireAdminSession();
  const db = await getDb();
  const albumPhotos = await db.select().from(photos).where(eq(photos.albumId, id));
  await db.delete(albums).where(eq(albums.id, id)); // cascades to photos rows
  // Best-effort — an orphaned Blob/local file just wastes a little storage,
  // never worth failing the delete over.
  await Promise.all(albumPhotos.map((ph) => deleteImage(ph.url.split("/").pop()!).catch(() => {})));
  revalidatePath("/gallery");
  redirect("/admin/albums");
}

export async function addPhoto(albumId: string, _prevState: AlbumFormState, formData: FormData): Promise<AlbumFormState> {
  await requireAdminSession();
  const parsed = photoSchema.safeParse({ caption: str(formData.get("caption")) });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  let url: string | null;
  try {
    url = await uploadFormImage(formData.get("image"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }
  if (!url) {
    return { error: "Choose an image to upload." };
  }

  const db = await getDb();
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(photos)
    .where(eq(photos.albumId, albumId));

  await db.insert(photos).values({ albumId, url, caption: parsed.data.caption || null, sortOrder: count });

  revalidatePath(`/gallery/${albumId}`);
  revalidatePath("/gallery");
  redirect(`/admin/albums/${albumId}`);
}

export async function deletePhoto(albumId: string, photoId: string) {
  await requireAdminSession();
  const db = await getDb();
  const [photo] = await db.select().from(photos).where(eq(photos.id, photoId));
  await db.delete(photos).where(eq(photos.id, photoId));
  if (photo) {
    // Best-effort — a dangling Blob/local file just wastes a little storage,
    // never worth failing the delete over.
    await deleteImage(photo.url.split("/").pop()!).catch(() => {});
  }
  revalidatePath(`/gallery/${albumId}`);
  revalidatePath("/gallery");
  redirect(`/admin/albums/${albumId}`);
}
