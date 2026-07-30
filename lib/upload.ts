import { MAX_UPLOAD_BYTES, uploadImage } from "./storage";

// Shared by every admin form that accepts an image (sermons, events, album
// photos) so the mime/size allowlist is enforced identically everywhere,
// not re-implemented per form. Returns null when no file was chosen (edit
// forms leave the field empty to keep the existing image).
//
// The declared `entry.size`/`entry.type` are only used here as a cheap early
// reject — the authoritative check is uploadImage()'s byte-signature sniff,
// since both are otherwise fully attacker-controlled in a crafted request.
export async function uploadFormImage(entry: FormDataEntryValue | null): Promise<string | null> {
  if (!(entry instanceof File) || entry.size === 0) return null;
  if (entry.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large (max 8MB).");
  }
  const bytes = new Uint8Array(await entry.arrayBuffer());
  const { url } = await uploadImage(bytes);
  return url;
}
