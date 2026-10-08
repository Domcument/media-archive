export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/test-token") {
      return new Response(
        JSON.stringify({
          tokenExists: !!env.TMDB_TOKEN,
          tokenLength: env.TMDB_TOKEN
            ? env.TMDB_TOKEN.length
            : 0
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
