"use client";

import { useState, useMemo } from "react";
import { Search, X, MapPin, Store, ArrowLeft, List } from "lucide-react";
import { LOCATIONS } from "@/data/locations";
import { GoogleMap } from "@/components/GoogleMap";
import { LocationCard } from "@/components/LocationCard";
import { LocationDetail } from "@/components/LocationDetail";
import { JoinPage } from "@/components/JoinPage";

const FILTER_OPTIONS = ["Todos", "Abierto ahora", "Accesible", "Cambiador", "Sin género"];

/* ─── Shared sub-components ─────────────────────────── */

function AppLogo({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#12907A" />
          <path d="M20 6C20 6 10 11 10 19.5C10 25 14.5 30 20 30C25.5 30 30 25 30 19.5C30 11 20 6 20 6Z" fill="white" fillOpacity="0.2" />
          <path d="M14 19.5L18 23.5L26 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 800, fontSize: 17, color: "#1C1C28", lineHeight: 1.1 }}>
            Restroom Friendly
          </p>
          <div className="flex items-center gap-1">
            <MapPin size={10} style={{ color: "#12907A" }} />
            <p style={{ fontSize: 11, color: "#6E6E82" }}>Buenos Aires, CABA</p>
          </div>
        </div>
      </div>
      <button
        onClick={onJoin}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{ background: "#EAF6F3", color: "#12907A", border: "1px solid #12907A30" }}
      >
        <Store size={13} />
        <span style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontSize: 12, fontWeight: 700 }}>Sumate</span>
      </button>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl"
      style={{ background: "#fff", border: "1px solid rgba(28,28,40,0.07)", boxShadow: "0 1px 4px rgba(28,28,40,0.06)" }}
    >
      <Search size={16} style={{ color: "#6E6E82", flexShrink: 0 }} />
      <input
        type="text"
        placeholder="Buscar por nombre, dirección o tipo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 outline-none bg-transparent"
        style={{ fontSize: 14, color: "#1C1C28", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
      />
      {value && (
        <button onClick={() => onChange("")}>
          <X size={14} style={{ color: "#6E6E82" }} />
        </button>
      )}
    </div>
  );
}

function Filters({ active, onChange }: { active: string; onChange: (f: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
      {FILTER_OPTIONS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full"
          style={{
            background: active === f ? "#12907A" : "#fff",
            color: active === f ? "#fff" : "#6E6E82",
            border: `1px solid ${active === f ? "#12907A" : "rgba(28,28,40,0.1)"}`,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function JoinCTA({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-2xl flex items-center justify-between"
      style={{ background: "#12907A" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}>
          <Store size={20} style={{ color: "#fff" }} />
        </div>
        <div className="text-left">
          <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>¿Tenés un local?</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Sumate gratis al programa</p>
        </div>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/* ─── Main page ──────────────────────────────────────── */

export default function Home() {
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const selectedLocation = LOCATIONS.find((l) => l.id === selectedId) ?? null;

  const filteredLocations = useMemo(
    () =>
      LOCATIONS.filter((loc) => {
        const matchSearch =
          search === "" ||
          loc.name.toLowerCase().includes(search.toLowerCase()) ||
          loc.address.toLowerCase().includes(search.toLowerCase()) ||
          loc.type.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
          activeFilter === "Todos" ||
          (activeFilter === "Abierto ahora" && loc.isOpen) ||
          (activeFilter === "Accesible" && loc.amenities.includes("accessible")) ||
          (activeFilter === "Cambiador" && loc.amenities.includes("baby-changing")) ||
          (activeFilter === "Sin género" && loc.amenities.includes("gender-neutral"));
        return matchSearch && matchFilter;
      }),
    [search, activeFilter]
  );

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setShowDetail(true);
    setShowJoin(false);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedId(null);
  };

  const handleOpenJoin = () => {
    setShowJoin(true);
    setShowDetail(false);
    setSelectedId(null);
  };

  const font = "var(--font-dm-sans), 'DM Sans', sans-serif";

  /* ── Sidebar panel content (desktop) ── */
  const sidebarPanel = () => {
    if (showJoin) {
      return (
        <div className="flex-1 overflow-hidden flex flex-col">
          <JoinPage onClose={() => setShowJoin(false)} />
        </div>
      );
    }
    if (showDetail && selectedLocation) {
      return (
        <div className="flex-1 overflow-hidden flex flex-col">
          <LocationDetail location={selectedLocation} onClose={handleCloseDetail} />
        </div>
      );
    }
    return (
      <>
        {/* Count */}
        <p className="px-5 pb-2 flex-shrink-0" style={{ fontSize: 13, color: "#6E6E82" }}>
          <span style={{ fontWeight: 700, color: "#1C1C28" }}>{filteredLocations.length}</span> locales cerca tuyo
        </p>
        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 space-y-2" style={{ scrollbarWidth: "none" }}>
          {filteredLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-4xl mb-3">🚽</div>
              <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 15, color: "#1C1C28" }}>
                No encontramos resultados
              </p>
              <p style={{ fontSize: 13, color: "#6E6E82", marginTop: 4 }}>Probá con otro filtro</p>
            </div>
          ) : (
            filteredLocations.map((loc) => (
              <LocationCard key={loc.id} location={loc} onClick={() => handleSelect(loc.id)} />
            ))
          )}
          <div style={{ height: 16 }} />
        </div>
        {/* Join CTA */}
        <div className="px-5 py-4 flex-shrink-0">
          <JoinCTA onClick={handleOpenJoin} />
        </div>
      </>
    );
  };

  return (
    <div style={{ fontFamily: font, background: "#E8E3DC" }}>

      {/* ════════════════════════════════════
          MOBILE layout  (hidden on md+)
          ════════════════════════════════════ */}
      <div className="md:hidden min-h-screen flex items-start justify-center">
        <div
          className="relative flex flex-col overflow-hidden w-full"
          style={{ height: "100dvh", maxWidth: 430, background: "#F5F3EE" }}
        >
          {/* Header */}
          <div className="px-4 pt-5 pb-3" style={{ background: "#F5F3EE", zIndex: 30, position: "relative" }}>
            <div className="mb-4">
              <AppLogo onJoin={handleOpenJoin} />
            </div>
            <SearchBar value={search} onChange={setSearch} />
            <div className="mt-3">
              <Filters active={activeFilter} onChange={setActiveFilter} />
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center justify-between px-4 pb-2">
            <p style={{ fontSize: 13, color: "#6E6E82" }}>
              <span style={{ fontWeight: 700, color: "#1C1C28" }}>{filteredLocations.length}</span> locales cerca tuyo
            </p>
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(28,28,40,0.1)" }}>
              {(["map", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setMobileView(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5"
                  style={{ background: mobileView === v ? "#12907A" : "#fff", color: mobileView === v ? "#fff" : "#6E6E82", fontSize: 12, fontWeight: 600 }}
                >
                  {v === "map"
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
                    : <List size={13} />
                  }
                  {v === "map" ? "Mapa" : "Lista"}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            {mobileView === "map" ? (
              <div className="h-full">
                <GoogleMap locations={filteredLocations} selected={selectedId} onSelect={handleSelect} />
                {selectedId && selectedLocation && !showDetail && (
                  <div className="absolute bottom-4 left-4 right-4" style={{ zIndex: 20 }}>
                    <LocationCard location={selectedLocation} onClick={() => setShowDetail(true)} compact />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full overflow-y-auto px-4 py-1 space-y-2" style={{ scrollbarWidth: "none" }}>
                {filteredLocations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-4xl mb-3">🚽</div>
                    <p style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif", fontWeight: 700, fontSize: 16, color: "#1C1C28" }}>No encontramos resultados</p>
                    <p style={{ fontSize: 13, color: "#6E6E82", marginTop: 4 }}>Probá con otro filtro o búsqueda</p>
                  </div>
                ) : (
                  filteredLocations.map((loc) => (
                    <LocationCard key={loc.id} location={loc} onClick={() => handleSelect(loc.id)} />
                  ))
                )}
                <div style={{ height: 24 }} />
              </div>
            )}
          </div>

          {/* Join CTA (list view) */}
          {mobileView === "list" && !showDetail && !showJoin && (
            <div className="px-4 pb-4 pt-1 flex-shrink-0">
              <JoinCTA onClick={handleOpenJoin} />
            </div>
          )}

          {/* Detail bottom sheet */}
          {showDetail && selectedLocation && (
            <>
              <div className="absolute inset-0" style={{ background: "rgba(28,28,40,0.4)", zIndex: 40, backdropFilter: "blur(2px)" }} onClick={handleCloseDetail} />
              <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl" style={{ background: "#fff", zIndex: 50, maxHeight: "82%", boxShadow: "0 -8px 40px rgba(28,28,40,0.18)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <LocationDetail location={selectedLocation} onClose={handleCloseDetail} />
              </div>
            </>
          )}

          {/* Join bottom sheet */}
          {showJoin && (
            <>
              <div className="absolute inset-0" style={{ background: "rgba(28,28,40,0.4)", zIndex: 40, backdropFilter: "blur(2px)" }} onClick={() => setShowJoin(false)} />
              <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl" style={{ background: "#fff", zIndex: 50, maxHeight: "90%", boxShadow: "0 -8px 40px rgba(28,28,40,0.18)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <JoinPage onClose={() => setShowJoin(false)} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════
          DESKTOP / TABLET layout (md+)
          ════════════════════════════════════ */}
      <div className="hidden md:flex" style={{ height: "100dvh" }}>

        {/* ── Left sidebar ── */}
        <div
          className="flex flex-col flex-shrink-0 shadow-xl"
          style={{ width: 390, background: "#F5F3EE", borderRight: "1px solid rgba(28,28,40,0.07)", zIndex: 20 }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(28,28,40,0.07)" }}>
            <AppLogo onJoin={handleOpenJoin} />
          </div>

          {/* Search + filters — only when not in detail/join panel */}
          {!showDetail && !showJoin && (
            <div className="px-5 pt-4 pb-3 flex-shrink-0">
              <SearchBar value={search} onChange={setSearch} />
              <div className="mt-3">
                <Filters active={activeFilter} onChange={setActiveFilter} />
              </div>
            </div>
          )}

          {/* Back button when in detail or join */}
          {(showDetail || showJoin) && (
            <div className="px-5 pt-4 pb-2 flex-shrink-0">
              <button
                onClick={() => { setShowDetail(false); setShowJoin(false); setSelectedId(null); }}
                className="flex items-center gap-2"
                style={{ fontSize: 13, color: "#6E6E82", fontWeight: 600 }}
              >
                <ArrowLeft size={15} />
                Volver a la lista
              </button>
            </div>
          )}

          {/* Scrollable panel (list, detail, or join) */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {sidebarPanel()}
          </div>
        </div>

        {/* ── Map (full remaining width) ── */}
        <div className="flex-1 relative">
          <GoogleMap
            locations={filteredLocations}
            selected={selectedId}
            onSelect={handleSelect}
          />

          {/* Selected card overlay on map (only when detail not open in sidebar) */}
          {selectedId && selectedLocation && !showDetail && !showJoin && (
            <div
              className="absolute bottom-6 left-6"
              style={{ zIndex: 20, width: 340 }}
            >
              <LocationCard location={selectedLocation} onClick={() => setShowDetail(true)} compact />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
