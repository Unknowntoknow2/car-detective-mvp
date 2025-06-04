import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const body = await req.json();
  console.log("Received follow-up submission:", body);

  return new Response(JSON.stringify({ status: "ok", received: body }), {
    headers: { "Content-Type": "application/json" },
  });
});
