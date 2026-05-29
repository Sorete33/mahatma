export async function onRequest(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const apiKey = env.GOOGLE_API_KEY;
  const response = await fetch(url);
  const data = await response.json();

// ADD THIS LINE to see the full response in your Cloudflare Functions logs
console.log("Google API Response:", JSON.stringify(data)); 

const reviews = data.result ? data.result.reviews : [];

  if (!placeId) return new Response("Missing", { status: 400 });

  // Usamos el endpoint de Places Details (API Antigua)
  // Remove the &fields=reviews
const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // La API antigua devuelve las reviews dentro de result.reviews
    const reviews = data.result ? data.result.reviews : [];
    
    return new Response(JSON.stringify(reviews || []), {
  headers: { 
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=86400' // Caches for 24 hours
  },
});
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}