// Appends a `saved=<message>` query param a Server Action can redirect() to —
// picked up once, globally, by components/admin/SaveToastListener.tsx, which
// shows it as a toast and strips the param from the URL.
export function savedRedirectPath(path: string, message: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}saved=${encodeURIComponent(message)}`;
}
