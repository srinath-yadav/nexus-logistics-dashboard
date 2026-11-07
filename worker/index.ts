export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // Health check: proves the Worker is running
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, time: new Date().toISOString() });
    }

    // Any other /api/ path that doesn't exist: a JSON 404, not the app's HTML
    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Everything else: the React app's files
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
