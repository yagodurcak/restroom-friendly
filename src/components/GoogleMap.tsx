"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { Location } from "@/data/locations";

interface GoogleMapProps {
  locations: Location[];
  selected: number | null;
  onSelect: (id: number) => void;
}

const CENTER = { lat: -34.5920, lng: -58.4310 };
const ZOOM = 14;
const PIN_COLOR = "#12907A";
const PIN_SELECTED = "#0d6b5a";

function makePinElement(selected: boolean): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.15s ease;
  `;

  const circle = document.createElement("div");
  circle.style.cssText = `
    width: ${selected ? 42 : 36}px;
    height: ${selected ? 42 : 36}px;
    border-radius: 50%;
    background: ${selected ? PIN_SELECTED : "#fff"};
    border: 2.5px solid ${PIN_COLOR};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(0,0,0,0.22);
  `;

  circle.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 7 4 13.5C4 17.64 7.58 21 12 21C16.42 21 20 17.64 20 13.5C20 7 12 2 12 2Z"
        fill="${selected ? "rgba(255,255,255,0.3)" : "rgba(18,144,122,0.15)"}"/>
      <path d="M9 13.5L11 15.5L15.5 11"
        stroke="${selected ? "#fff" : PIN_COLOR}"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const tail = document.createElement("div");
  tail.style.cssText = `
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${selected ? PIN_SELECTED : "#fff"};
    margin-top: -1px;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15));
  `;

  wrapper.appendChild(circle);
  wrapper.appendChild(tail);
  return wrapper;
}

export function GoogleMap({ locations, selected, onSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const initializedRef = useRef(false);

  /* Initialize map once */
  useEffect(() => {
    if (initializedRef.current || !mapRef.current) return;
    initializedRef.current = true;

    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      v: "weekly",
    });

    (async () => {
      try {
        const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await importLibrary("marker") as google.maps.MarkerLibrary;

        const map = new Map(mapRef.current!, {
          center: CENTER,
          zoom: ZOOM,
          mapId: "restroom-friendly",
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: undefined,
        });

        mapInstanceRef.current = map;

        locations.forEach((loc) => {
          const markerEl = makePinElement(false);
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: loc.lat, lng: loc.lng },
            title: loc.name,
            content: markerEl,
          });

          marker.addListener("click", () => onSelect(loc.id));
          markersRef.current.set(loc.id, marker);
        });
      } catch (e) {
        console.error("Google Maps error:", e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Update markers and pan when selected changes */
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.content as HTMLElement;
      if (!el) return;
      const isSelected = id === selected;
      const circle = el.firstElementChild as HTMLElement;
      const tail = el.lastElementChild as HTMLElement;
      if (!circle || !tail) return;

      circle.style.width = isSelected ? "42px" : "36px";
      circle.style.height = isSelected ? "42px" : "36px";
      circle.style.background = isSelected ? PIN_SELECTED : "#fff";

      const svg = circle.querySelector("svg");
      if (svg) {
        const path1 = svg.querySelector("path:first-child");
        const path2 = svg.querySelector("path:last-child");
        if (path1) path1.setAttribute("fill", isSelected ? "rgba(255,255,255,0.3)" : "rgba(18,144,122,0.15)");
        if (path2) path2.setAttribute("stroke", isSelected ? "#fff" : PIN_COLOR);
      }

      tail.style.borderTopColor = isSelected ? PIN_SELECTED : "#fff";
    });

    if (selected !== null && mapInstanceRef.current) {
      const loc = locations.find((l) => l.id === selected);
      if (loc) {
        mapInstanceRef.current.panTo({ lat: loc.lat, lng: loc.lng });
      }
    }
  }, [selected, locations]);

  /* Re-render markers when filtered locations change */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const visibleIds = new Set(locations.map((l) => l.id));
    markersRef.current.forEach((marker, id) => {
      marker.map = visibleIds.has(id) ? map : null;
    });
  }, [locations]);

  return <div ref={mapRef} className="w-full h-full" />;
}
