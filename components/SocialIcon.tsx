import type { SocialLink } from "@/lib/data";

export default function SocialIcon({ platform, size = 36 }: { platform: SocialLink["key"]; size?: number }) {
  if (platform === "youtube") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#FF0000" />
        <path d="M9.5 8.3l6.2 3.7-6.2 3.7z" fill="#fff" />
      </svg>
    );
  }
  if (platform === "facebook") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path
          d="M14.7 8.4h-1.3c-.5 0-.6.2-.6.6v1.3h1.9l-.25 2h-1.65v6h-2.3v-6H9v-2h1.55V8.9c0-1.7.9-2.7 2.6-2.7h1.55z"
          fill="#fff"
        />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#C13584" />
        <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="15.7" cy="8.3" r="1" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        d="M12 6.5a5.5 5.5 0 00-4.7 8.4l-.8 2.6 2.7-.8A5.5 5.5 0 1012 6.5z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.3"
      />
      <path
        d="M9.9 9.9c.15-.3.35-.3.5-.3h.35c.15 0 .25.05.35.3l.4 1c.05.15 0 .3-.1.4l-.25.3c-.1.1-.1.2 0 .35.3.55.8 1.05 1.4 1.35.12.06.25.05.35-.05l.3-.3c.1-.1.25-.1.4-.05l1 .4c.25.1.3.2.3.35v.35c0 .2-.05.35-.35.55-.45.25-1 .25-1.8 0-1.2-.4-2.4-1.6-2.8-2.8-.3-.8-.3-1.35 0-1.65z"
        fill="#fff"
      />
    </svg>
  );
}
