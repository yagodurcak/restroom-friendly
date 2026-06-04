"use client";

import { RestroomBadge } from "./Badge";
import type { Location } from "@/data/locations";

interface MapMockProps {
  locations: Location[];
  selected: number | null;
  onSelect: (id: number) => void;
  userPos?: { x: number; y: number };
}

export function MapMock({ locations, selected, onSelect, userPos = { x: 50, y: 55 } }: MapMockProps) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#E2D9CC" }}>
      {/* City grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="#EDE6DC" />
            <rect x="16" y="0" width="48" height="80" fill="#DDD4C7" />
            <rect x="0" y="16" width="80" height="48" fill="#DDD4C7" />
            <rect x="16" y="16" width="48" height="48" fill="#F0EAE0" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect x="0" y="46%" width="100%" height="8" fill="#CBBFB0" opacity="0.9" />
        <rect x="48%" y="0" width="8" height="100%" fill="#CBBFB0" opacity="0.9" />
        <rect x="0" y="72%" width="100%" height="5" fill="#CBBFB0" opacity="0.6" />
        <rect x="0" y="25%" width="100%" height="5" fill="#CBBFB0" opacity="0.6" />
        <rect x="22%" y="0" width="5" height="100%" fill="#CBBFB0" opacity="0.6" />
        <rect x="74%" y="0" width="5" height="100%" fill="#CBBFB0" opacity="0.6" />
        <rect x="55%" y="58%" width="14%" height="12%" rx="4" fill="#AECFA4" opacity="0.7" />
        <rect x="28%" y="30%" width="8%" height="8%" rx="3" fill="#AECFA4" opacity="0.6" />
      </svg>

      {/* Pins */}
      {locations.map((loc) => (
        <button
          key={loc.id}
          onClick={() => onSelect(loc.id)}
          className="absolute transition-all duration-200"
          style={{
            left: `${loc.x}%`,
            top: `${loc.y}%`,
            transform: "translate(-50%, -100%)",
            zIndex: selected === loc.id ? 20 : 10,
          }}
        >
          <div className="relative flex flex-col items-center" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.22))" }}>
            {selected === loc.id && (
              <div
                className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg whitespace-nowrap"
                style={{ background: "#1C1C28", color: "#fff", fontFamily: "var(--font-nunito), Nunito, sans-serif", fontSize: 11, fontWeight: 700 }}
              >
                {loc.name}
              </div>
            )}
            <div
              className="rounded-full flex items-center justify-center border-2"
              style={{
                width: selected === loc.id ? 42 : 36,
                height: selected === loc.id ? 42 : 36,
                background: selected === loc.id ? "#12907A" : "#fff",
                borderColor: "#12907A",
                transition: "all 0.2s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C12 2 4 7 4 13.5C4 17.64 7.58 21 12 21C16.42 21 20 17.64 20 13.5C20 7 12 2 12 2Z"
                  fill={selected === loc.id ? "white" : "#12907A"}
                  fillOpacity="0.3"
                />
                <path
                  d="M9 13.5L11 15.5L15.5 11"
                  stroke={selected === loc.id ? "white" : "#12907A"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: `8px solid ${selected === loc.id ? "#12907A" : "#fff"}`,
                marginTop: -1,
              }}
            />
          </div>
        </button>
      ))}

      {/* User dot */}
      <div
        className="absolute"
        style={{ left: `${userPos.x}%`, top: `${userPos.y}%`, transform: "translate(-50%, -50%)", zIndex: 15 }}
      >
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full animate-ping"
            style={{ width: 32, height: 32, background: "#4A90D9", opacity: 0.25 }}
          />
          <div
            className="rounded-full border-2 border-white"
            style={{ width: 16, height: 16, background: "#4A90D9", boxShadow: "0 2px 6px rgba(74,144,217,0.5)" }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-3 left-3 px-3 py-2 rounded-xl flex items-center gap-2" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}>
        <div className="w-3 h-3 rounded-full" style={{ background: "#12907A" }} />
        <span style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontSize: 11, color: "#1C1C28", fontWeight: 500 }}>
          {locations.length} baños disponibles
        </span>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.7)", color: "#888", fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontSize: 9 }}>
        Mapa simulado · Restroom Friendly
      </div>
    </div>
  );
}
