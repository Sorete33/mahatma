export async function onRequest(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url); // This is the request URL
  const placeId = searchParams.get('placeId');
  const apiKey = env.GOOGLE_API_KEY;

  if (!placeId) return new Response("Missing ID", { status: 400 });

  // Use a different variable name here to avoid collision
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Check if Google returned an error
    if (data.status !== "OK") {
      console.error("Google API Error:", data.status, data.error_message);
      return new Response(JSON.stringify({ error: data.status }), { status: 502 });
    }

    const reviews = data.result?.reviews || [];
    
    return new Response(JSON.stringify(reviews), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' 
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}