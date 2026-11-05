# NEXUS: Architecture & Build Guide

NEXUS is a logistics command dashboard. It shows shipments moving between global hubs on an interactive 3D globe, lists and filters shipments, shows a single shipment's route and timeline, and visualises hub load as 3D towers.

This document records **how the app is architected, why each choice was made, the order it was built in, and how it is deployed**. Keep it in the repo root and update it when a decision changes.

---

## 1. Goals and non-goals

**Goals**
- A fast, good-looking React dashboard that demonstrates real-time UI, 3D rendering and clean state management.
- Heavy 3D where it adds meaning: the globe, the shipment route view and the hub towers.
- Runs fully in the browser on simulated data, so anyone can open the live demo with no backend.
- Smooth on a mid-range laptop and usable on a phone.

**Non-goals (for v1)**
- No real carrier APIs, authentication or database. Data is simulated (see §5).
- No pixel-perfect geography. The globe is a stylised "data globe", not a map.

---

## 2. Screens

Designed in the NEXUS design canvas (four artboards):

| Route | Screen | Main content |
|---|---|---|
| `/` | Overview | KPI cards, 3D globe with live routes, live events feed |
| `/shipments` | Shipments | Status filter chips, searchable shipment table |
| `/shipments/:id` | Shipment detail | 3D route view that follows the vessel, AI summary, timeline |
| `/fleet` | Fleet & hubs | 3D hub towers (height = load), hub capacity cards |

Visual language: dark "command centre" background, **cyan = on schedule / live**, **amber = delayed**, **red = exception**. Display font Chakra Petch, body Manrope, data JetBrains Mono.

---

## 3. Tech stack and why

| Concern | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev server, simple config, static output that deploys anywhere |
| UI | **React 18 + TypeScript** | Component model, type safety across the data model |
| Routing | **React Router** | Four routes, nested layout with a persistent header and 3D canvas |
| 3D | **three.js + React Three Fiber (R3F)** | Write the 3D scene as React components; shares state with the UI |
| 3D helpers | **@react-three/drei** | OrbitControls, Stars, Line, Html labels, so we don't hand-write them |
| Animation | **GSAP** for UI and camera moves, `useFrame` for per-frame 3D motion | GSAP timelines are easy to sequence; `useFrame` runs inside the render loop |
| State | **Zustand** | Tiny global store that both React UI and R3F components can read without re-rendering everything |
| Styling | **CSS Modules + CSS variables** | Scoped styles; design tokens in one `tokens.css` |
| Charts (2D) | Plain SVG components | Few, simple charts; no need for a chart library |

> **Version note:** React Three Fiber v8 pairs with React 18, and v9 with React 19. Pick the pair that matches your React version when you install.

---

## 4. Folder structure

```
nexus/
├─ public/
├─ src/
│  ├─ main.tsx                 # app entry, router setup
│  ├─ App.tsx                  # layout: Header + <Outlet/> + persistent <Scene/>
│  ├─ styles/
│  │  ├─ tokens.css            # colors, fonts, spacing (from the design)
│  │  └─ global.css
│  ├─ data/
│  │  ├─ hubs.ts               # 8 hubs with lat/lon and code
│  │  ├─ seed.ts               # initial shipments
│  │  └─ simulation.ts         # tick(): advances progress, raises events
│  ├─ store/
│  │  └─ useNexusStore.ts      # Zustand store: shipments, events, selection, view
│  ├─ lib/
│  │  ├─ geo.ts                # latLonToVector3(), arcPoints()
│  │  └─ format.ts             # dates, numbers, status labels
│  ├─ three/
│  │  ├─ Scene.tsx             # the ONE <Canvas>; swaps scene per route
│  │  ├─ CameraRig.tsx         # GSAP camera transitions between views
│  │  ├─ Globe.tsx             # dotted sphere + atmosphere
│  │  ├─ Routes.tsx            # arcs + moving packets (instanced)
│  │  ├─ HubMarkers.tsx
│  │  ├─ RouteFocus.tsx        # single-shipment view
│  │  └─ HubTowers.tsx         # fleet view
│  ├─ components/
│  │  ├─ Header/
│  │  ├─ KpiCard/
│  │  ├─ EventFeed/
│  │  ├─ ShipmentTable/
│  │  ├─ StatusChip/
│  │  ├─ Timeline/
│  │  └─ AiSummary/
│  └─ pages/
│     ├─ Overview.tsx
│     ├─ Shipments.tsx
│     ├─ ShipmentDetail.tsx
│     └─ Fleet.tsx
├─ ARCHITECTURE.md             # this file
└─ README.md
```

---

## 5. Data model and simulation

All data lives in the Zustand store and is driven by a simulation, so the UI looks live without a backend.

```ts
type Status = 'in_transit' | 'delayed' | 'exception' | 'delivered';

interface Hub { code: string; city: string; lat: number; lon: number; vehicles: number; capacity: number; }

interface Shipment {
  id: string;            // "NX-24817"
  from: string; to: string;   // hub codes
  carrier: string;
  progress: number;      // 0..1
  speed: number;         // progress per second (sim time)
  status: Status;
  eta: string;           // ISO date
}

interface NexusEvent { at: string; shipmentId: string; text: string; level: 'info' | 'warn' | 'error'; }
```

**Simulation (`simulation.ts`)**
- `setInterval` every 1s calls `tick()`.
- `tick()` advances each shipment's `progress` by its `speed`, marks it `delivered` at 1, and with a small random chance marks one `delayed` or `exception` and pushes an event.
- Keep the simulation **pure**: `tick(state) => newState`, so it's easy to test.

**Why Zustand here:** the 3D packets need to read `progress` every frame. R3F components read the store **inside `useFrame` via `useNexusStore.getState()`** instead of subscribing, so the 3D layer moves smoothly without forcing React re-renders 60 times a second.

---

## 6. 3D architecture

### One canvas for the whole app
`<Scene/>` is rendered once in `App.tsx`, **behind** the page content, and never unmounts. Each route tells the store which view it wants (`overview`, `detail`, `fleet`), and `Scene` swaps the 3D content while `CameraRig` animates the camera.

> **Lesson learned:** browsers allow only a limited number of WebGL contexts. Mounting a new `<Canvas>` per page or per card eventually hits that limit and the oldest scenes go blank. One shared canvas avoids it. (Use drei's `<View>` if you ever need several 3D panels in one layout.)

### Globe
- Sphere of dots: generate ~6k points on a sphere (Fibonacci distribution) and draw them as one `THREE.Points` object.
- Atmosphere: a slightly larger sphere with a fresnel-style shader or additive transparent material.
- Hubs: `latLonToVector3(lat, lon, radius)` places a marker for each hub.

```ts
export function latLonToVector3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}
```

### Routes and moving packets
- Each route is a `QuadraticBezierCurve3` from origin to destination, with the control point lifted above the surface (height grows with distance).
- Draw routes with drei `<Line>`; colour by status.
- Packets: one **`InstancedMesh`** for all shipments. In `useFrame`, set each instance's position to `curve.getPoint(progress)`. One draw call instead of hundreds.

### Hub towers (Fleet view)
- One `InstancedMesh` of boxes; scale Y by hub load. Hover with R3F pointer events to show an `<Html>` label.

### Performance rules
- Clamp pixel ratio: `<Canvas dpr={[1, 2]}>`.
- Use instancing for anything repeated (packets, towers, dots).
- Never `setState` inside `useFrame`; mutate refs.
- Pause rendering when the tab is hidden (`frameloop="demand"` plus `invalidate()`, or stop the sim on `visibilitychange`).
- Lazy-load the 3D bundle with `React.lazy` so the page shell appears first.
- On small screens, reduce dot count and disable post-processing.

---

## 7. UI layer

- **Layout:** `App.tsx` renders `Header`, the persistent `Scene` (absolute, behind), and `<Outlet/>` for the page. Pages render 2D panels on top of the canvas.
- **Pointer events:** panels sit above the canvas; the globe area in each page is transparent so drag/zoom reaches the canvas.
- **Components are dumb:** they take props; pages connect them to the store with selectors (`useNexusStore(s => s.events)`).
- **Accessibility:** real `<button>`/`<a>`, visible focus rings, and a text alternative for each 3D view (for example, the table under the globe).

---

## 8. AI summary (optional feature)

The shipment detail page shows a short plain-English summary ("On track, main risk is berth congestion…").

- **v1:** generate it from rules in the browser (template strings based on status, delay and ETA). No API key needed.
- **v2:** call an LLM through a small **serverless function** (a Cloudflare Worker route such as `/api/summary`). The function holds the API key; the browser never sees it. It sends the shipment JSON and returns 2–3 sentences.

Never put an API key in front-end code or in `VITE_` env variables; anything prefixed `VITE_` is shipped to the browser.

---

## 9. Build order

Each phase ends with something visible.

1. **Setup:** Vite + React + TS, router with four empty pages, header, `tokens.css`.
2. **Data:** hubs, seed shipments, Zustand store, `tick()` simulation; show raw data in a table.
3. **Shipments page:** table, status chips, search filter.
4. **Scene skeleton:** one persistent `<Canvas>`, OrbitControls, stars, globe of dots.
5. **Hubs + routes:** markers, bezier arcs coloured by status.
6. **Live packets:** instanced packets moving with simulation progress.
7. **Overview page:** KPI cards and event feed around the globe.
8. **Shipment detail:** `RouteFocus` view, camera follows the packet, timeline, rule-based AI summary.
9. **Fleet page:** instanced hub towers and hub cards.
10. **Camera transitions:** GSAP camera moves between views.
11. **Polish:** loading state, responsive layout, reduced-motion support, performance pass.
12. **Deploy** (§10), then add screenshots and the live link to `README.md`.

---

## 10. Deployment

The app builds to static files, so it deploys to **Cloudflare** (same account as `srinathyadav.dev`).

### Build
```bash
npm run build      # outputs dist/
npm run preview    # check the production build locally
```

### Single-page app routing
Routes such as `/shipments/NX-24817` must serve `index.html`. On Cloudflare Workers static assets, set the SPA fallback in `wrangler.jsonc`:

```jsonc
{
  "name": "nexus",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

### Option A: Git-connected (recommended)
1. Push the repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository**.
3. Build command `npm run build`, output directory `dist`.
4. Every push to `main` deploys to production; pull requests get preview URLs.

### Option B: Manual
```bash
npx wrangler deploy
```

### Custom domain
Add **`nexus.srinathyadav.dev`** under the project's **Settings → Domains & Routes → Custom domain**. Cloudflare creates the DNS record and HTTPS automatically.

### Environment variables
- v1 needs none.
- v2 (LLM summary): add the API key as a **secret** in the Worker settings, never in the repo.

### Post-deploy checklist
- [ ] Deep link `/shipments/NX-24817` loads directly (SPA fallback works)
- [ ] Globe renders on Chrome, Safari and a phone
- [ ] Lighthouse performance and accessibility checked
- [ ] Live link and screenshots added to `README.md` and the portfolio

---

## 11. Decision log

| # | Decision | Reason | Alternatives considered |
|---|---|---|---|
| 1 | Simulated data, no backend | Demo works for anyone, instantly | Mock API server, real carrier APIs |
| 2 | One persistent `<Canvas>` | Avoids the WebGL context limit; smooth camera moves between pages | One canvas per page |
| 3 | Zustand over Redux/Context | Readable from inside `useFrame` without re-renders | Redux Toolkit, React Context |
| 4 | Instanced meshes | One draw call for hundreds of packets/towers | Individual meshes |
| 5 | Cloudflare deploy | Same account as the portfolio domain, free tier, SPA support | Netlify, Vercel |

---

## 12. Next steps

- Real map data (country outlines from GeoJSON) on the globe.
- LLM-powered summaries and a "Ask about this shipment" chat (v2, §8).
- Unit tests for `tick()` and `geo.ts` with Vitest.
- Persist filters in the URL so views are shareable.
