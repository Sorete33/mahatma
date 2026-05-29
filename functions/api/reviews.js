export async function onRequest(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const apiKey = env.GOOGLE_API_KEY;

  if (!placeId) return new Response("Missing ID", { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  
  // Log the full response to the Cloudflare dashboard for inspection
  console.log("DEBUG RESPONSE:", JSON.stringify(data));

  if (data.status !== "OK") {
    return new Response(JSON.stringify({ error: data.status, msg: data.error_message }), { status: 500 });
  }

  const reviews = data.result?.reviews || [];
  return new Response(JSON.stringify(reviews), {
    headers: { 'Content-Type': 'application/json' },
  });
}