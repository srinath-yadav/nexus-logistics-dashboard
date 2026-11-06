# NEXUS: Architecture

NEXUS is a logistics command dashboard. It shows shipments moving between global hubs on an interactive 3D globe, with KPI cards and a live events feed around it. Later pages list and filter shipments, show one shipment's route and timeline, and visualise hub load.

This document records **how the app is built, why each choice was made, and how it will be deployed**. Update it whenever a decision changes.

**Status:** the header, routing, Overview layout and the complete 3D globe are built. The store, simulation and remaining pages are planned (see §10).

---

## 1. Goals and non-goals

**Goals**

- A fast, good-looking React dashboard that demonstrates real-time UI, 3D rendering and clean state management.
- 3D where it carries meaning: the globe, and later the shipment route view and hub load towers.
- Runs fully in the browser on simulated data, so anyone can open the demo with no backend.
- Smooth on a mid-range laptop and usable on a phone.

**Non-goals (v1)**

- No real carrier APIs, authentication or database.
- No pixel-perfect geography beyond what the Earth textures provide.

---

## 2. Screens

| Route            | Screen                                              | Status                                     |
| ---------------- | --------------------------------------------------- | ------------------------------------------ |
| `/`              | **Overview**: KPI cards, 3D globe, live events feed | Layout and globe done; events feed planned |
| `/shipments`     | Shipments table with status filter and search       | Placeholder                                |
| `/shipments/:id` | Shipment detail: route view, AI summary, timeline   | Placeholder (reads `:id`)                  |
| `/fleet`         | Fleet & hubs: 3D hub load towers, hub cards         | Placeholder                                |
| `*`              | Not found                                           | Done                                       |

**Visual language:** dark "command centre" UI. Display font Chakra Petch, body Manrope, data JetBrains Mono. Status colours follow the logistics convention (§6).

---

## 3. Tech stack and why

| Concern    | Choice                                                      | Why                                                                                         |
| ---------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Build tool | **Vite**                                                    | Fast dev server, static output that deploys anywhere                                        |
| UI         | **React 19 + TypeScript**                                   | Component model; types across the data model                                                |
| Routing    | **React Router**                                            | Four routes sharing one layout (header + main)                                              |
| Styling    | **Tailwind CSS v4** with `@theme` tokens                    | Colours and fonts defined once in `index.css`, used as classes (`bg-panel`, `text-delayed`) |
| 3D         | **three.js + React Three Fiber**                            | The scene is written as React components                                                    |
| 3D helpers | **drei**                                                    | `OrbitControls`, `useTexture`, `Line`, `Html`, `useProgress`                                |
| Shaders    | **GLSL** via `shaderMaterial`                               | City lights and atmosphere need per-pixel logic the built-in materials don't offer          |
| Animation  | **GSAP** for the intro; **`useFrame`** for per-frame motion | Timelines for one-off sequences; the render loop for continuous motion                      |
| State      | **Zustand** (planned)                                       | A small store that both React UI and 3D code can read without re-rendering everything       |
| Lint       | **Oxlint**                                                  | Fast linting, including the rules of hooks                                                  |

React Three Fiber v9 is paired with React 19 (v8 pairs with React 18).

---

## 4. Folder structure

```
src/
├─ main.tsx
├─ App.tsx                     # BrowserRouter + layout: <Header/> above <Routes/>
├─ index.css                   # Tailwind import, @theme tokens, base body styles
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx            # logo, NavLink nav, search, LiveClock, avatar
│  │  └─ LiveClock.tsx         # IST clock, updates every 30 s
│  └─ overview/
│     ├─ KeyMetrics.tsx        # list of KpiCards
│     ├─ KpiCard.tsx           # one metric card
│     ├─ GlobePanel.tsx        # panel, title overlay, legend, renders <GlobeScene/>
│     └─ LiveEvents.tsx        # events feed (planned)
├─ pages/                      # one component per route
│  ├─ Overview.tsx  Shipments.tsx  ShipmentDetail.tsx  Fleet.tsx  NotFound.tsx
├─ three/                      # everything rendered inside <Canvas>
│  ├─ GlobeScene.tsx           # Canvas, camera, lights, controls; composes the scene
│  ├─ IntroSpin.tsx            # GSAP scale + spin on first load
│  ├─ Loader.tsx               # texture loading progress (Suspense fallback)
│  ├─ Earth.tsx                # day, normal and specular maps on a Phong sphere
│  ├─ CityLights.tsx           # night-side lights (custom shader)
│  ├─ cityLightsShader.ts
│  ├─ Clouds.tsx               # drifting cloud layer
│  ├─ Atmosphere.tsx           # edge glow (custom shader)
│  ├─ atmosphereShader.ts
│  ├─ HubMarkers.tsx           # 8 hubs with pulsing rings
│  ├─ routeData.ts             # builds route curves from shipments (shared)
│  ├─ RouteArcs.tsx            # route lines, coloured by status
│  ├─ Packets.tsx              # moving packets (InstancedMesh)
│  └─ constants.ts             # SUN_DIRECTION
├─ data/                       # sample data (moves into the store in phase 2)
│  ├─ hubs.ts  shipments.ts  metrics.ts
├─ lib/                        # pure helpers, no React
│  ├─ geo.ts                   # latLonToVector3(), arcCurve()
│  ├─ status.ts                # STATUS_COLORS
│  └─ timeformatter.ts         # IST time format
├─ types/                      # hub, shipment and header types
└─ constants/                  # NAV_ITEMS, LEGEND_ITEMS
public/
└─ textures/                   # Earth textures (2K)
```

**Rules**

- `three/` contains only code that runs inside `<Canvas>`.
- `pages/` contains only screens a route points to.
- `lib/` is pure functions with no React, so it is easy to test.
- One component per file; PascalCase for components, camelCase for helpers.

---

## 5. Data model

```ts
type ShipmentStatus = "in_transit" | "delayed" | "exception" | "delivered";

type Hub = { code: string; city: string; lat: number; lon: number };

type Shipment = {
  id: string; // "NX-24817"
  from: string;
  to: string; // hub codes
  carrier: string;
  status: ShipmentStatus;
  progress: number; // 0..1 along the route
  speed: number; // progress per second (demo animation)
};
```

Today the data is static (`src/data/`). In phase 2 it moves into a Zustand store driven by a simulation (§10).

---

## 6. Design tokens and status colours

Tokens live in `@theme` in `index.css`, so each becomes Tailwind classes:

| Group        | Tokens                                                              |
| ------------ | ------------------------------------------------------------------- |
| Surfaces     | `bg`, `bar`, `panel`, `raised`, `field`, `line`, `line-strong`      |
| Text         | `ink`, `muted`                                                      |
| Brand / live | `live` (cyan): LIVE clock, hub rings, focus outlines                |
| Status       | `transit` blue, `delivered` green, `delayed` amber, `exception` red |

The same status hex values are in `src/lib/status.ts`, because three.js materials need real colour values, not Tailwind classes. **Keep the two in sync.**

Colour is never the only signal: delayed routes are dashed, exception routes are thicker, and every status in the UI has a text label.

Tailwind class names are always written as complete strings (never built with template pieces like `` `bg-${status}` ``), so Tailwind can detect them at build time.

---

## 7. 3D architecture

### Scene composition (`GlobeScene.tsx`)

```
<Canvas camera dpr={[1,2]}>
  background colour, ambient light, directional "sun" light
  <Suspense fallback={<Loader/>}>
    <IntroSpin>
      Earth → CityLights → Clouds → Atmosphere → HubMarkers → RouteArcs → Packets
    </IntroSpin>
  </Suspense>
  <OrbitControls/>
</Canvas>
```

Layers are spheres at slightly increasing radii so they never fight for the same depth: Earth `1.0`, city lights `1.002`, clouds `1.01`, hubs and routes `1.015`, atmosphere `1.15`.

### Coordinates

`latLonToVector3(lat, lon, radius)` converts real coordinates to a point on the sphere:

```
phi   = radians(90 − lat)     // angle down from the North Pole
theta = radians(lon + 180)    // angle around; matches how three.js wraps the texture
x = −r·sin(phi)·cos(theta),  y = r·cos(phi),  z = r·sin(phi)·sin(theta)
```

Verified with a test marker on Chennai.

### Lighting and the sun

`SUN_DIRECTION` (in `three/constants.ts`) is shared by the directional light and the city-lights shader, so both always agree on where it is day. It points over India so the dashboard opens on a sunlit India.

### Earth (`Earth.tsx`)

`meshPhongMaterial` with:

- `map`: day texture (colour image, so `SRGBColorSpace`)
- `normalMap`: terrain relief (data image, linear)
- `specularMap`: water shines, land is matte (data image, linear)

### Custom shaders

| Shader          | Idea                                                                                                                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **City lights** | Uses world-space normals. `dot(normal, sunDirection)` tells day from night; `smoothstep` creates a soft twilight band. Drawn on a slightly larger sphere with additive blending, so black adds nothing and only lights glow. |
| **Atmosphere**  | Uses view-space normals. A larger sphere drawn with `BackSide` leaves only a ring around the Earth; brightness fades from the Earth's edge into space. Additive blending.                                                    |

### Routes and packets

- `routeData.ts` builds every route **once**: hub lookup, `latLonToVector3`, then `arcCurve()`, a quadratic Bézier whose control point is lifted higher for longer routes. It returns the curve and 65 sampled points.
- `GlobeScene` calls it once (`useMemo`) and passes the same routes to `RouteArcs` (drei `Line`) and `Packets`.
- `Packets` is one **`InstancedMesh`**: every packet in a single draw call. Each frame, progress (kept in a ref) advances by `speed × delta`; `curve.getPoint(progress)` gives the position; `setMatrixAt` writes it. Colours are set once with `setColorAt`.

### Performance rules

- Pixel ratio clamped with `dpr={[1, 2]}`.
- Instancing for anything repeated.
- Never `setState` inside `useFrame`; mutate refs and objects directly.
- Uniforms and geometry inputs created with `useMemo`.
- 2K textures (about 2.3 MB total); normal map as PNG, the rest JPG.
- One `<Canvas>` only. Browsers limit WebGL contexts; one canvas per panel eventually makes older ones go blank.

### Accessibility and motion

- `IntroSpin` respects `prefers-reduced-motion` (auto-rotate should follow the same setting; see §10).
- The globe panel has a screen-reader description, and the legend explains every visual signal in text.

---

## 8. UI layer

- **Layout:** `App.tsx` renders a full-height flex column: `Header`, then `<main className="flex-1 min-h-0">` with the routes. `min-h-0` lets the content shrink so the page never overflows.
- **Overview:** three columns: KPI cards (fixed width), globe panel (`flex-1 min-w-0`), events feed (fixed width).
- **Globe panel:** the canvas fills the panel with `absolute inset-0`; title and legend are overlays with `pointer-events-none` so dragging still reaches the globe.
- **Header:** `NavLink` active styling, visually hidden label for search, responsive wrap with `order` so search moves to its own row on small screens.

---

## 9. AI summary (planned)

The shipment detail page will show a short plain-English summary of a shipment's status and risks.

- **v1:** generated from rules in the browser (status, delay, ETA). No API key.
- **v2:** a serverless function (Cloudflare Worker, `/api/summary`) calls an LLM. The key is stored as a Worker secret and never reaches the browser.

Never put an API key in front-end code or in `VITE_` variables; anything prefixed `VITE_` ships to the browser.

---

## 10. Build plan

| #   | Phase                                                                                                                                    | Status  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | Setup, routing, header, design tokens                                                                                                    | ✅ Done |
| 2   | Overview layout and KPI cards                                                                                                            | ✅ Done |
| 3   | 3D globe: Earth, lighting, city lights, clouds, atmosphere                                                                               | ✅ Done |
| 4   | Hubs, route arcs, instanced packets, intro, loader, legend                                                                               | ✅ Done |
| 5   | **Zustand store + simulation:** `tick()` advances shipments, raises delays and events; KPIs computed from the store; globe reads from it | Next    |
| 6   | Live events feed                                                                                                                         | Planned |
| 7   | Shipments page: table, status chips, filter, search                                                                                      | Planned |
| 8   | Shipment detail: route view, timeline, rule-based AI summary                                                                             | Planned |
| 9   | Fleet page: instanced hub towers, hub cards                                                                                              | Planned |
| 10  | Polish: responsive layout, performance pass, reduced-motion auto-rotate, tests (Vitest for `lib/` and `tick()`)                          | Planned |
| 11  | Deploy (§11)                                                                                                                             | Planned |

**Simulation plan (phase 5):** a pure `tick(state) => newState` runs every second. It advances `progress`, marks shipments delivered at 1, occasionally flags a delay or exception, and appends an event. Components read with selectors; 3D code reads with `useNexusStore.getState()` inside `useFrame` so animation never causes React re-renders.

---

## 11. Deployment (planned)

The app builds to static files and will deploy to **Cloudflare**, in the same account as `srinathyadav.dev`.

```bash
npm run build      # outputs dist/
npm run preview    # check the production build locally
```

**Single-page app routing:** deep links such as `/shipments/NX-24817` must serve `index.html`. With Cloudflare Workers static assets, set this in `wrangler.jsonc`:

```jsonc
{
  "name": "nexus",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application",
  },
}
```

**Recommended:** connect the GitHub repo in Cloudflare (Workers & Pages → Import a repository), build command `npm run build`, output `dist`. Every push to `main` deploys; pull requests get preview URLs. Custom domain: `nexus.srinathyadav.dev`.

**Important:** Cloudflare builds on Linux, where file names are case-sensitive. An import must match the file name's exact capitals (this caught `NotFound.tsx` once).

**Post-deploy checklist**

- [ ] Deep link `/shipments/NX-24817` loads directly
- [ ] Globe renders in Chrome, Safari and on a phone
- [ ] Lighthouse performance and accessibility checked
- [ ] Live link and screenshot in README and portfolio

---

## 12. Decision log

| #   | Decision                                             | Reason                                                                                 | Alternatives considered                       |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | Simulated data, no backend                           | Demo works for anyone, instantly                                                       | Mock API server, real carrier APIs            |
| 2   | Tailwind v4 with `@theme` tokens                     | One source of truth for colours and fonts; fast to style                               | CSS Modules, plain CSS                        |
| 3   | Real Earth textures instead of a dotted "data globe" | Recognisable geography; city lights reinforce the logistics story                      | Dot-sphere, GeoJSON outlines                  |
| 4   | Phong material for the Earth                         | Built-in `specularMap` slot: oceans shine, land is matte, from one image               | Standard (PBR) with an inverted roughness map |
| 5   | Custom GLSL for city lights and atmosphere           | Built-in materials can't fade lights by sun direction or draw a view-dependent rim     | Emissive map (lights also on day side)        |
| 6   | Upright globe (no 23.4° axial tilt)                  | Easier to read; every child object would otherwise need to sit in the tilted group     | Tilted group                                  |
| 7   | Route data built once and shared                     | Arcs and packets use the same curves; one place to change when data moves to the store | Each component building its own curves        |
| 8   | `InstancedMesh` for packets                          | One draw call for any number of shipments                                              | One mesh per packet                           |
| 9   | Industry-standard status colours                     | Users recognise blue/green/amber/red instantly; separates status from brand cyan       | Brand-coloured statuses                       |
| 10  | Zustand over Redux/Context (planned)                 | Readable from inside `useFrame` without re-renders                                     | Redux Toolkit, React Context                  |
| 11  | Cloudflare deploy                                    | Same account as the portfolio domain, free tier, SPA support                           | Netlify, Vercel                               |

---

## 13. Credits

Earth textures: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0).
