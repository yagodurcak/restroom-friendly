"use client";

import { MapPin, Clock, Star, Accessibility, Baby, Users } from "lucide-react";
import { RestroomBadge } from "./Badge";
import type { Location } from "@/data/locations";

interface LocationCardProps {
  location: Location;
  onClick: () => void;
  compact?: boolean;
}

const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  accessible: { icon: <Accessibility size={12} />, label: "Accesible" },
  "baby-changing": { icon: <Baby size={12} />, label: "Cambiador" },
  "gender-neutral": { icon: <Users size={12} />, label: "Sin género" },
};

const typeColors: Record<string, string> = {
  "Café": "#D4704A",
  "Farmacia": "#4A90D9",
  "Librería": "#9B6FD4",
  "Supermercado": "#4AB06A",
  "Restaurante": "#D4A84A",
  "Hotel": "#D44A7A",
  "Banco": "#4AABD4",
  "Panadería": "#B07A4A",
};

function getEmoji(type: string): string {
  const map: Record<string, string> = {
    "Café": "☕",
    "Farmacia": "💊",
    "Librería": "📚",
    "Supermercado": "🛒",
    "Restaurante": "🍽️",
    "Hotel": "🏨",
    "Banco": "🏦",
    "Panadería": "🥐",
  };
  return map[type] || "🏪";
}

export function LocationCard({ location, onClick, compact = false }: LocationCardProps) {
  const typeColor = typeColors[location.type] || "#888";

  return (
    <button onClick={onClick} className="w-full text-left transition-all duration-150 active:scale-[0.99]">
      <div
        className="flex gap-3 p-4 rounded-2xl"
        style={{ background: "#fff", border: "1px solid rgba(28,28,40,0.07)", boxShadow: "0 2px 8px rgba(28,28,40,0.06)" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 48, height: 48, background: `${typeColor}18`, color: typeColor }}
        >
          <span style={{ fontSize: 22 }}>{getEmoji(location.type)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 15, color: "#1C1C28", lineHeight: 1.3 }}>
                {location.name}
              </p>
              <p style={{ fontSize: 12, color: "#6E6E82", marginTop: 1 }}>{location.type}</p>
            </div>
            <RestroomBadge size="sm" variant="icon" />
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: "#6E6E82" }}>
              <MapPin size={11} style={{ color: "#12907A" }} />
              {location.distance}
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: location.isOpen ? "#12907A" : "#D4183D" }}>
              <Clock size={11} />
              {location.isOpen ? "Abierto" : "Cerrado"} · {location.hours}
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: "#6E6E82" }}>
              <Star size={11} style={{ color: "#F5A623", fill: "#F5A623" }} />
              {location.rating} ({location.reviews})
            </span>
          </div>

          {!compact && location.amenities.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {location.amenities.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "#EAF6F3", color: "#12907A", fontSize: 11, fontWeight: 500 }}
                >
                  {amenityIcons[a]?.icon}
                  {amenityIcons[a]?.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
