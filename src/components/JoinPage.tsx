"use client";

import { useState } from "react";
import { X, Store, Check, ChevronRight, Star, Users, Clock } from "lucide-react";
import { RestroomBadge } from "./Badge";

interface JoinPageProps {
  onClose: () => void;
}

const BENEFITS = [
  { icon: <Star size={18} style={{ color: "#F5A623" }} />, title: "Mayor visibilidad", desc: "Aparecé en el mapa de miles de usuarios diariamente" },
  { icon: <Users size={18} style={{ color: "#12907A" }} />, title: "Más clientes", desc: "Los usuarios que te visitan suelen volver a consumir" },
  { icon: <Check size={18} style={{ color: "#12907A" }} />, title: "Badge exclusivo", desc: "Mostrá el badge 'Restroom Friendly' en tu local y redes" },
  { icon: <Clock size={18} style={{ color: "#4A90D9" }} />, title: "Sin costo", desc: "El programa es completamente gratuito para los locales" },
];

const STEPS = ["Nombre del local", "Contacto", "Confirmación"];

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1C28", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl outline-none"
        style={{
          background: "#F5F3EE",
          border: "1px solid rgba(28,28,40,0.08)",
          fontSize: 14,
          color: "#1C1C28",
          fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
        }}
      />
    </div>
  );
}

export function JoinPage({ onClose }: JoinPageProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", type: "", address: "", email: "", phone: "", hours: "", amenities: [] as string[] });
  const [submitted, setSubmitted] = useState(false);

  const amenityOptions = [
    { id: "accessible", label: "Accesible para sillas de ruedas" },
    { id: "baby-changing", label: "Cambiador de bebés" },
    { id: "gender-neutral", label: "Baño sin distinción de género" },
    { id: "clean-guarantee", label: "Limpieza garantizada cada 2h" },
  ];

  const toggleAmenity = (id: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="flex items-center justify-center rounded-full mb-6" style={{ width: 80, height: 80, background: "#EAF6F3" }}>
          <Check size={36} style={{ color: "#12907A" }} />
        </div>
        <RestroomBadge size="lg" />
        <h2 style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 24, color: "#1C1C28", marginTop: 20, marginBottom: 8 }}>
          ¡Bienvenido al programa!
        </h2>
        <p style={{ fontSize: 15, color: "#6E6E82", lineHeight: 1.6 }}>
          Revisaremos tu solicitud en las próximas 24 horas y te enviaremos el badge digital y el kit de bienvenida.
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-3.5 rounded-2xl w-full"
          style={{ background: "#12907A", color: "#fff", fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 16 }}
        >
          Volver al mapa
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full" style={{ background: "#E0D9D0" }} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex items-start justify-between pt-2 pb-5">
          <div>
            <p style={{ fontSize: 12, color: "#12907A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Para comercios</p>
            <h2 style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 22, color: "#1C1C28", marginTop: 2 }}>
              Sumate al programa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: "#EDE9E0" }}
          >
            <X size={18} style={{ color: "#1C1C28" }} />
          </button>
        </div>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="p-3 rounded-2xl" style={{ background: "#F5F3EE" }}>
                <div className="mb-2">{b.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1C28", fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>{b.title}</p>
                <p style={{ fontSize: 11, color: "#6E6E82", marginTop: 2, lineHeight: 1.4 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-5">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 22, height: 22, background: i <= step ? "#12907A" : "#EDE9E0", color: i <= step ? "#fff" : "#6E6E82", fontSize: 11, fontWeight: 700 }}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i === step ? "#1C1C28" : "#6E6E82", fontWeight: i === step ? 600 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 12, height: 1, background: "#EDE9E0", marginRight: 4 }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3">
            <FormField label="Nombre del local" placeholder="Ej: Café San Martín" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1C28", display: "block", marginBottom: 6 }}>Tipo de local</label>
              <div className="grid grid-cols-3 gap-2">
                {["Café", "Restaurante", "Farmacia", "Librería", "Supermercado", "Otro"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className="py-2 px-2 rounded-xl text-center transition-all"
                    style={{ background: form.type === t ? "#12907A" : "#F5F3EE", color: form.type === t ? "#fff" : "#1C1C28", fontSize: 13, fontWeight: 600 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <FormField label="Dirección" placeholder="Ej: Corrientes 1234, CABA" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />
            <FormField label="Horario de atención" placeholder="Ej: Lun–Vie 8:00–20:00" value={form.hours} onChange={(v) => setForm((p) => ({ ...p, hours: v }))} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1C28", display: "block", marginBottom: 8 }}>Facilidades del baño</label>
              <div className="space-y-2">
                {amenityOptions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{ background: form.amenities.includes(a.id) ? "#EAF6F3" : "#F5F3EE", border: `1px solid ${form.amenities.includes(a.id) ? "#12907A" : "transparent"}` }}
                  >
                    <span style={{ fontSize: 13, color: "#1C1C28" }}>{a.label}</span>
                    <div className="flex items-center justify-center rounded-full" style={{ width: 20, height: 20, background: form.amenities.includes(a.id) ? "#12907A" : "#E0D9D0" }}>
                      {form.amenities.includes(a.id) && <Check size={12} style={{ color: "#fff" }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p style={{ fontSize: 14, color: "#6E6E82", lineHeight: 1.6, marginBottom: 4 }}>
              Te enviamos el kit de bienvenida y confirmación de adhesión por estos medios.
            </p>
            <FormField label="Email de contacto" placeholder="hola@tucafe.com" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} type="email" />
            <FormField label="Teléfono (opcional)" placeholder="+54 11 0000 0000" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} type="tel" />
            <div className="p-4 rounded-2xl" style={{ background: "#EAF6F3", border: "1px solid #12907A20" }}>
              <p style={{ fontSize: 13, color: "#12907A", fontWeight: 600 }}>¿Qué incluye el kit?</p>
              <ul className="mt-2 space-y-1">
                {["Badge digital para redes sociales", "Cartel imprimible para la entrada", "Acceso al panel de gestión", "Reporte mensual de visitas"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={12} style={{ color: "#12907A", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#3D3D4E" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl" style={{ background: "#F5F3EE" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1C28", fontFamily: "var(--font-nunito), Nunito, sans-serif", marginBottom: 10 }}>Resumen de adhesión</p>
              {[
                { label: "Local", value: form.name || "—" },
                { label: "Tipo", value: form.type || "—" },
                { label: "Dirección", value: form.address || "—" },
                { label: "Horario", value: form.hours || "—" },
                { label: "Email", value: form.email || "—" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(28,28,40,0.06)" }}>
                  <span style={{ fontSize: 13, color: "#6E6E82" }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: "#1C1C28", fontWeight: 600 }}>{r.value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#6E6E82", lineHeight: 1.6, textAlign: "center" }}>
              Al enviar, aceptás los términos del programa Restroom Friendly.
            </p>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 pt-3" style={{ borderTop: "1px solid rgba(28,28,40,0.07)" }}>
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 52, height: 52, background: "#EDE9E0", color: "#1C1C28", flexShrink: 0 }}
            >
              <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
            </button>
          )}
          <button
            onClick={() => { if (step < 2) setStep((s) => s + 1); else setSubmitted(true); }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl"
            style={{ background: "#12907A", color: "#fff" }}
          >
            <Store size={16} />
            <span style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 15 }}>
              {step === 2 ? "Enviar solicitud" : "Continuar"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
