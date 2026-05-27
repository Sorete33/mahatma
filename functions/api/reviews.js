// functions/api/reviews.js
export async function onRequest(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const apiKey = env.GOGOLE_API_KEY;

  if (!placeId) {
    return new Response("Missing placeId", { status: 400 });
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return new Response(JSON.stringify(data.reviews || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response("Error fetching reviews", { status: 500 });
  }
}