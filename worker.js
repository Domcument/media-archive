export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // TMDB search endpoint
    if (url.pathname === "/api/search") {
      const query = url.searchParams.get("q");

      if (!query) {
        return new Response(
          JSON.stringify({
            error: "Missing search query."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const tmdbUrl = new URL(
        "https://api.themoviedb.org/3/search/multi"
      );

      tmdbUrl.searchParams.set("query", query);
      tmdbUrl.searchParams.set("include_adult", "false");
      tmdbUrl.searchParams.set("language", "en-US");

      const response = await fetch(tmdbUrl, {
        headers: {
          Authorization: `Bearer ${env.TMDB_TOKEN}`,
          accept: "application/json"
        }
      });

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: "TMDB request failed."
          }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const data = await response.json();

      return new Response(
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // Serve the normal website
    return env.ASSETS.fetch(request);
  }
};
