import { handleSummary } from "./summary";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // Health check: proves the Worker is running
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, time: new Date().toISOString() });
    }

    // Shipment summary (must come BEFORE the catch-all below)
    if (url.pathname === "/api/summary") {
      return handleSummary(request, env);
    }

    // Any other /api/ path that doesn't exist: a JSON 404
    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Everything else: the React app's files
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
