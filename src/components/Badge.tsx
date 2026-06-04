"use client";

interface BadgeProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export function RestroomBadge({ size = "md", variant = "full" }: BadgeProps) {
  const sizes = { sm: 28, md: 40, lg: 56 };
  const px = sizes[size];

  if (variant === "icon") {
    return (
      <svg width={px} height={px} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#12907A" />
        <path d="M20 8C20 8 10 12.5 10 20.5C10 25.5 14.5 30 20 30C25.5 30 30 25.5 30 20.5C30 12.5 20 8 20 8Z" fill="white" fillOpacity="0.2" />
        <path d="M15 20.5L18.5 24L25 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="9" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#12907A" }}>
      <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4C20 4 8 9.5 8 19.5C8 26 13.4 31 20 31C26.6 31 32 26 32 19.5C32 9.5 20 4 20 4Z" fill="white" fillOpacity="0.25" />
        <path d="M14 20L18 24L26 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
        Restroom Friendly
      </span>
    </div>
  );
}
