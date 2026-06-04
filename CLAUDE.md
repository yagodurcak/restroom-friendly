# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# Restroom Friendly — Instrucciones de desarrollo

## Verificación de UI obligatoria

Después de completar cualquier tarea que involucre cambios visuales o de funcionalidad en la app, SIEMPRE debés:

1. Confirmar que el servidor de desarrollo está corriendo en http://localhost:3000
2. Usar el MCP de Playwright para tomar un screenshot de la página
3. Revisar el screenshot e informar qué se ve y si el resultado es correcto
4. Si algo no se ve bien, corregirlo antes de reportar la tarea como terminada

No reportes una tarea de UI como "lista" sin haber tomado y revisado el screenshot.

## Comandos

```bash
npm run dev      # Servidor de desarrollo en http://localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
```

No hay tests configurados en el proyecto.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Google Maps JS API (`@googlemaps/js-api-loader`) — requiere `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en `.env.local`
- Supabase (a conectar)
- Fuentes: Nunito (`--font-nunito`) y DM Sans (`--font-dm-sans`) vía `next/font/google`

## Arquitectura

La app es una sola página (`src/app/page.tsx`) que actúa como controlador de estado. Mantiene `selectedLocation` y `showList` y los pasa como props a los componentes hijos. No hay routing ni páginas adicionales.

### Flujo de datos

```
locations.ts (datos estáticos)
    ↓
page.tsx (estado: selectedLocation, showList)
    ├── Map.tsx (Google Maps real, SSR deshabilitado con dynamic import)
    │       lee locations directamente, emite onSelectLocation
    ├── LocationList → LocationCard (lista scrolleable)
    │       recibe locations + selectedId, emite onSelect
    └── LocationCard (card overlay flotante sobre el mapa)
            recibe location seleccionada, emite onClose
```

### Dos implementaciones de mapa

- **`Map.tsx`**: mapa real con Google Maps JS API. Carga la librería async con `importLibrary("maps")`. Necesita `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Se importa con `dynamic(..., { ssr: false })` porque usa APIs del browser.
- **`MapMock.tsx`**: mapa simulado con SVG. Usa los campos `x`/`y` (porcentaje de posición) del tipo `Location`. No requiere API key. Útil para desarrollo sin credenciales.

### Modelo de datos (`src/data/locations.ts`)

El tipo `Location` incluye:
- `x`, `y` — coordenadas en porcentaje para `MapMock`
- `lat`, `lng` — coordenadas reales para `Map.tsx` (Google Maps)
- `amenities` — array de strings: `"accessible"`, `"baby-changing"`, `"gender-neutral"`
- `isOpen` — booleano estático (no calculado desde `hours`)

Los datos están hardcodeados para el MVP. Cuando se conecte Supabase, este archivo se reemplaza por llamadas al cliente de Supabase.

### Componentes

- **`Badge.tsx`** — `RestroomBadge`: badge de marca, variants `"full"` (con texto) e `"icon"` (solo SVG)
- **`LocationCard.tsx`** — tarjeta compacta con nombre, tipo, distancia, estado, rating y amenities
- **`LocationDetail.tsx`** — panel de detalle completo con reviews hardcodeados, acciones "Confirmar" y "Reportar", botón "Cómo llegar"
- **`LocationList.tsx`** — lista de `LocationCard`s
- **`MapMock.tsx`** — mapa SVG simulado con pins interactivos y punto de usuario

## Estructura

- `src/app/` — páginas y layout
- `src/components/` — componentes React
- `src/data/locations.ts` — datos hardcodeados de locales (MVP)

## Dev server

```bash
cd /Users/mauriciodurcak/Codigo/restroom-friendly/app-mvp
npm run dev
```

Corre en http://localhost:3000
