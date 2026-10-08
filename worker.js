export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Test endpoint
    if (url.pathname === "/api/test") {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Media Archive API is working."
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Let Cloudflare serve the normal website files
    return env.ASSETS.fetch(request);
  }
};
