"use client";

import { useState } from "react";
import { X, MapPin, Clock, Star, Phone, Accessibility, Baby, Users, Navigation, Share2, ThumbsUp } from "lucide-react";
import { RestroomBadge } from "./Badge";
import type { Location } from "@/data/locations";

interface LocationDetailProps {
  location: Location;
  onClose: () => void;
}

const amenityDetails: Record<string, { icon: React.ReactNode; label: string; desc: string }> = {
  accessible: {
    icon: <Accessibility size={16} />,
    label: "Accesible",
    desc: "Rampa y barras de apoyo",
  },
  "baby-changing": {
    icon: <Baby size={16} />,
    label: "Cambiador de bebés",
    desc: "Mesa en el baño familiar",
  },
  "gender-neutral": {
    icon: <Users size={16} />,
    label: "Sin distinción de género",
    desc: "Baño inclusivo para todes",
  },
};

const REVIEWS = [
  { id: 1, user: "Valentina M.", text: "Muy limpio y el personal súper amable. Lo recomiendo!", stars: 5, time: "hace 2 días" },
  { id: 2, user: "Lucas P.", text: "Funciona perfecto. Nada de presión para consumir.", stars: 5, time: "hace 1 semana" },
  { id: 3, user: "María J.", text: "El baño accesible está bien equipado, fácil entrada.", stars: 4, time: "hace 2 semanas" },
];

function InfoChip({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <div className="flex items-center gap-1">{icon}</div>
      <p style={{ fontSize: 11, color: "#6E6E82" }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: valueColor || "#1C1C28", fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>{value}</p>
    </div>
  );
}

function DetailRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <p style={{ fontSize: 14, color: "#3D3D4E" }}>{label}</p>
    </div>
  );
}

export function LocationDetail({ location, onClose }: LocationDetailProps) {
  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full" style={{ background: "#E0D9D0" }} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex items-start justify-between gap-3 pt-2 pb-4">
          <div className="flex-1">
            <RestroomBadge size="sm" />
            <h2 style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 22, color: "#1C1C28", marginTop: 8, lineHeight: 1.25 }}>
              {location.name}
            </h2>
            <p style={{ fontSize: 14, color: "#6E6E82", marginTop: 2 }}>{location.type}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: "#EDE9E0", color: "#1C1C28" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl mb-4" style={{ background: "#F5F3EE" }}>
          <InfoChip icon={<MapPin size={14} style={{ color: "#12907A" }} />} label="Distancia" value={location.distance} />
          <InfoChip
            icon={<Clock size={14} style={{ color: location.isOpen ? "#12907A" : "#D4183D" }} />}
            label="Estado"
            value={location.isOpen ? "Abierto" : "Cerrado"}
            valueColor={location.isOpen ? "#12907A" : "#D4183D"}
          />
          <InfoChip
            icon={<Star size={14} style={{ color: "#F5A623", fill: "#F5A623" }} />}
            label="Valoración"
            value={`${location.rating}/5`}
          />
        </div>

        <div className="space-y-3 mb-4">
          <DetailRow icon={<MapPin size={16} style={{ color: "#12907A" }} />} label={location.address} />
          <DetailRow icon={<Clock size={16} style={{ color: "#12907A" }} />} label={`Horario: ${location.hours}`} />
          {location.phone && (
            <DetailRow icon={<Phone size={16} style={{ color: "#12907A" }} />} label={location.phone} />
          )}
        </div>

        {location.amenities.length > 0 && (
          <div className="mb-4">
            <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: "#1C1C28", marginBottom: 10 }}>
              Instalaciones
            </p>
            <div className="space-y-2">
              {location.amenities.map((a) => {
                const detail = amenityDetails[a];
                if (!detail) return null;
                return (
                  <div key={a} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#EAF6F3" }}>
                    <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: "#fff", color: "#12907A" }}>
                      {detail.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1C28" }}>{detail.label}</p>
                      <p style={{ fontSize: 12, color: "#6E6E82" }}>{detail.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: "#1C1C28" }}>
              Comentarios ({location.reviews})
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} style={{ color: "#F5A623", fill: s <= Math.round(location.rating) ? "#F5A623" : "none" }} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {REVIEWS.map((r) => (
              <div key={r.id} className="p-3 rounded-xl" style={{ background: "#F5F3EE" }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1C28" }}>{r.user}</span>
                  <span style={{ fontSize: 11, color: "#6E6E82" }}>{r.time}</span>
                </div>
                <p style={{ fontSize: 13, color: "#3D3D4E", lineHeight: 1.5 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setLiked(!liked)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
            style={{
              background: liked ? "#EAF6F3" : "#F5F3EE",
              color: liked ? "#12907A" : "#6E6E82",
              border: `1px solid ${liked ? "#12907A" : "transparent"}`,
            }}
          >
            <ThumbsUp size={15} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{liked ? "¡Gracias!" : "Confirmar"}</span>
          </button>
          <button
            onClick={() => setReported(!reported)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
            style={{
              background: reported ? "#FFF0F0" : "#F5F3EE",
              color: reported ? "#D4183D" : "#6E6E82",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>{reported ? "Reportado" : "Reportar problema"}</span>
          </button>
        </div>
      </div>

      <div className="px-5 pb-6 pt-2" style={{ borderTop: "1px solid rgba(28,28,40,0.07)" }}>
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl"
            style={{ background: "#12907A", color: "#fff" }}
          >
            <Navigation size={16} />
            <span style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 15 }}>Cómo llegar</span>
          </button>
          <button
            className="flex items-center justify-center rounded-2xl"
            style={{ width: 52, height: 52, background: "#EDE9E0", color: "#1C1C28" }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
